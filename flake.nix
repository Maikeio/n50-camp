{
  description = "n50-camp — the event site (tent viewer), server-rendered by Astro on Node and run as a hardened systemd service";

  inputs.nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";

  outputs =
    { self, nixpkgs }:
    let
      inherit (nixpkgs) lib;

      systems = [
        "x86_64-linux"
        "aarch64-linux"
        "x86_64-darwin"
        "aarch64-darwin"
      ];

      forAllSystems = f: lib.genAttrs systems (system: f nixpkgs.legacyPackages.${system});
    in
    {
      # Overlay that adds both packages to pkgs.
      overlays.default = final: prev: {
        # The server-rendered website. `astro build` with the @astrojs/node
        # adapter (standalone mode) emits a self-contained Node server in
        # dist/server/entry.mjs plus static assets in dist/client/. Pages are
        # rendered per-request, so they can use request-time data (e.g. the
        # current date for time-based features) — the site still ships zero
        # client JavaScript. We keep dist/ and a production-only node_modules/
        # (the bundle imports a few deps — astro's runtime helpers, unstorage,
        # etc. — as externals at runtime).
        n50-camp = final.buildNpmPackage {
          pname = "n50-camp";
          version = "0.3.0";

          # Flakes copy the git tree, so node_modules/, dist/ and .astro/ (all
          # gitignored) are excluded automatically.
          src = ./.;

          npmDepsHash = "sha256-ZLV8sgZCXoV+k5mkxSQLhAnhWVOIQeeCgYyLIBOlsuY=";

          # Fully offline, deterministic build.
          env.ASTRO_TELEMETRY_DISABLED = "1";

          # This is a server app, not an npm library: skip the default
          # `npm pack` install. After `npm run build`, drop the devDependencies
          # and ship the rendered output together with the runtime node_modules.
          dontNpmInstall = true;
          installPhase = ''
            runHook preInstall

            npm prune --omit=dev

            mkdir -p "$out/lib/n50-camp"
            cp -r dist node_modules package.json "$out/lib/n50-camp/"

            runHook postInstall
          '';

          meta = {
            description = "Server-rendered n50-camp event website (Astro + Node)";
            platforms = lib.platforms.all;
          };
        };

        # A thin launcher for the standalone Astro/Node server. The built app is
        # baked in, so it always serves exactly the n50-camp site. The Astro
        # Node adapter reads HOST/PORT from the environment; we expose them under
        # the N50_CAMP_* names with sensible defaults. Real filesystem isolation
        # is added by the NixOS module's systemd sandbox.
        n50-camp-server = final.writeShellApplication {
          name = "n50-camp-server";
          runtimeInputs = [ final.nodejs ];
          text = ''
            export HOST="''${N50_CAMP_HOST:-::}"
            export PORT="''${N50_CAMP_PORT:-8080}"
            export NODE_ENV=production
            exec node "${final.n50-camp}/lib/n50-camp/dist/server/entry.mjs" "$@"
          '';
        };
      };

      packages = forAllSystems (
        pkgs:
        let
          ext = pkgs.extend self.overlays.default;
        in
        {
          inherit (ext) n50-camp n50-camp-server;
          default = ext.n50-camp-server;
        }
      );

      # NixOS module: applies the overlay and runs the server as a hardened,
      # sandboxed systemd service.
      nixosModules.default =
        {
          config,
          lib,
          pkgs,
          ...
        }:
        let
          cfg = config.services.n50-camp;
        in
        {
          options.services.n50-camp = {
            enable = lib.mkEnableOption "the n50-camp event website server";

            package = lib.mkOption {
              type = lib.types.package;
              default = pkgs.n50-camp-server;
              defaultText = lib.literalExpression "pkgs.n50-camp-server";
              description = "The server package to run.";
            };

            host = lib.mkOption {
              type = lib.types.str;
              default = "::";
              example = "127.0.0.1";
              description = "Address to bind to. Defaults to all interfaces (IPv4 + IPv6).";
            };

            port = lib.mkOption {
              type = lib.types.port;
              default = 8080;
              description = "TCP port to listen on.";
            };

            openFirewall = lib.mkOption {
              type = lib.types.bool;
              default = false;
              description = "Open {option}`port` in the firewall.";
            };
          };

          config = lib.mkIf cfg.enable {
            nixpkgs.overlays = [ self.overlays.default ];

            networking.firewall.allowedTCPPorts = lib.mkIf cfg.openFirewall [ cfg.port ];

            systemd.services.n50-camp = {
              description = "n50-camp event website (Astro/Node SSR)";
              wantedBy = [ "multi-user.target" ];
              after = [ "network.target" ];

              environment = {
                N50_CAMP_HOST = cfg.host;
                N50_CAMP_PORT = toString cfg.port;
                # Astro sessions default to filesystem storage; keep that scratch
                # state inside the service's private /tmp.
                TMPDIR = "/tmp";
              };

              serviceConfig = {
                ExecStart = lib.getExe cfg.package;
                Restart = "on-failure";

                # Run as a transient, unprivileged user.
                DynamicUser = true;

                # Filesystem: the process gets no writable or readable access to
                # anything outside the (read-only) nix store, save a private
                # /tmp for Node/Astro scratch state. "only http".
                ProtectSystem = "strict";
                ProtectHome = true;
                PrivateTmp = true;
                PrivateDevices = true;
                ProtectProc = "invisible";
                UMask = "0077";

                # Privilege / namespace lockdown.
                NoNewPrivileges = true;
                RestrictNamespaces = true;
                LockPersonality = true;
                # NB: no MemoryDenyWriteExecute — V8's JIT needs writable+
                # executable mappings, so it is incompatible with Node.
                RestrictRealtime = true;
                RestrictSUIDSGID = true;
                ProtectControlGroups = true;
                ProtectKernelTunables = true;
                ProtectKernelModules = true;
                ProtectKernelLogs = true;
                ProtectClock = true;
                ProtectHostname = true;
                RemoveIPC = true;

                # Networking: HTTP over IP only.
                RestrictAddressFamilies = [
                  "AF_INET"
                  "AF_INET6"
                ];

                # Drop all capabilities, granting only the bind capability when a
                # privileged (<1024) port is requested.
                CapabilityBoundingSet = lib.optionals (cfg.port < 1024) [ "CAP_NET_BIND_SERVICE" ];
                AmbientCapabilities = lib.optionals (cfg.port < 1024) [ "CAP_NET_BIND_SERVICE" ];

                # Syscall allow-list. Kept broad enough for the V8/libuv runtime
                # (no ~@resources filter, which trips up the GC/threadpool).
                SystemCallArchitectures = "native";
                SystemCallFilter = [
                  "@system-service"
                  "~@privileged"
                ];
              };
            };
          };
        };

      formatter = forAllSystems (pkgs: pkgs.nixfmt-rfc-style);

      devShells = forAllSystems (pkgs: {
        default = pkgs.mkShell {
          packages = [
            pkgs.nodejs
          ];
        };
      });
    };
}
