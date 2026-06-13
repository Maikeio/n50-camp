import { defineConfig } from "astro/config";
import preact from "@astrojs/preact";

// Preact integration so <Tent> can be authored in real JSX and rendered to
// static HTML at build time. No `client:*` directive is used, so zero JS ships
// for the tents — only the small inline camera-slider script runs in the browser.
export default defineConfig({
  integrations: [preact()],
});
