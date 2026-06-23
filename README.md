# n50.camp

n50.camp website. The site ships zero client JavaScript\* — the hero, the camera fly-in and the reveals are all pure CSS.

\*on chromium-based browsers; Firefox needs a polyfill

## Run

```sh
# With npm installed
npm run dev
# Without npm installed
nix shell nixpkgs#nodejs --command sh -c "npm install && npm run dev"
```

See flake.nix for an example on how to package and run this.

## Deploy

Add `nixosModules.default` exported by the flake to your nixos configuration and enable the service:

```nix
services.n50campen = {
  enable = true;
  host = "[::1]";
  port = 4324;
}
```
