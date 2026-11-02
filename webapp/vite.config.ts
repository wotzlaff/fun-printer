import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// On GitHub Pages the app lives under /fun-printer/; locally serve from the root.
const base = process.env.CI ? "/fun-printer/" : "/";

export default defineConfig({
  base,
  plugins: [react()],
});
