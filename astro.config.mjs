import { defineConfig } from "astro/config";
import preact from "@astrojs/preact";

// Preact integration so <Tents> can be authored in real JSX and rendered to
// static HTML at build time. No `client:*` directive is used, so the site ships
// zero JavaScript — the camera fly-in and reveals are pure CSS.
export default defineConfig({
  integrations: [preact()],
  build: {
    // emit all CSS into <style> tags in the HTML head instead of a linked
    // stylesheet — saves a request (the font is already inlined into the CSS)
    inlineStylesheets: "always",
  },
  vite: {
    build: {
      // inline the subset wordmark font (~10KB) as a base64 data URL so it
      // ships inside the CSS — one fewer request and no late font swap
      assetsInlineLimit: 16384,
    },
  },
});
