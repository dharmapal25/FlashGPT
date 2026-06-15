import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  plugins: [
    react(),

    VitePWA({
      registerType: "autoUpdate",
      // generateSW with sensible runtimeCaching for API calls
      strategies: 'generateSW',
      includeAssets: ['favicon.svg', 'favicon.ico'],
      manifest: {
        name: 'FlashGPT',
        short_name: 'FlashGPT',
        description: 'AI Chat Assistant',
        theme_color: '#000000',
        background_color: '#0d0f13',
        display: 'standalone',
        scope: '/',
        start_url: '/',
        icons: [
          { src: '/FLASHGPT_ICON.png', sizes: '192x192', type: 'image/png' },
          { src: '/FLASHGPT.png', sizes: '512x512', type: 'image/png' }
        ]
      },
      workbox: {
        cleanupOutdatedCaches: true,
        navigateFallback: '/',
        runtimeCaching: [
          {
            urlPattern: /\/api\//,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'api-cache',
              expiration: { maxEntries: 100, maxAgeSeconds: 60 * 60 },
              networkTimeoutSeconds: 10
            }
          },
          {
            urlPattern: /\.(?:png|jpg|jpeg|svg|webp)$/,
            handler: 'CacheFirst',
            options: {
              cacheName: 'image-cache',
              expiration: { maxEntries: 100, maxAgeSeconds: 24 * 60 * 60 }
            }
          }
        ]
      },
      devOptions: {
        enabled: true,
        type: 'module'
      }
    })
  ]
  ,
  // build optimizations
  build: {
    target: 'es2018',
    outDir: 'dist',
    brotliSize: false,
    chunkSizeWarningLimit: 2000,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            return id.toString().split('node_modules/')[1].split('/')[0].toString();
          }
        }
      }
    }
  },
  optimizeDeps: {
    include: ['react', 'react-dom']
  }
});