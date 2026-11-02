import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

// On GitHub Pages the app lives under /fun-printer/; locally serve from the root.
const base = process.env.CI ? "/fun-printer/" : "/";

export default defineConfig({
  base,
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: ["icons/icon-192.png", "icons/icon-512.png"],
      manifest: {
        name: "Fun Printer",
        short_name: "FunPrint",
        description:
          "Alternative UI for small Bluetooth thermal printers (MX10, '51 78' protocol)",
        theme_color: "#101418",
        background_color: "#101418",
        display: "standalone",
        start_url: base,
        icons: [
          { src: "icons/icon-192.png", sizes: "192x192", type: "image/png" },
          { src: "icons/icon-512.png", sizes: "512x512", type: "image/png" },
        ],
      },
      workbox: {
        globPatterns: ["**/*.{js,css,html,ico,png,svg,woff2}"],
        navigateFallback: base + "index.html",
      },
    }),
  ],
});
