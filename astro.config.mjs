import { defineConfig } from "astro/config";

// The site ships zero JavaScript — every component is a static .astro file and
// the camera fly-in is pure CSS.
export default defineConfig({
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
