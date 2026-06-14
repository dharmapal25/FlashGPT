import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  plugins: [
    react(),

    VitePWA({
      registerType: "autoUpdate",

      manifest: {
        name: "FlashGPT",
        short_name: "FlashGPT",
        description: "AI Chat Assistant",
        theme_color: "#000000",

        icons: [
          {
            src: "/FLASHGPT_ICON.png",
            sizes: "192x192",
            type: "image/png"
          },
          {
            src: "/FLASHGPT.png",
            sizes: "512x512",
            type: "image/png"
          }
        ]
      }
    })
  ]
});