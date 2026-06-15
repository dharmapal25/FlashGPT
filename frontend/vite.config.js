import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  plugins: [
    react(),

    VitePWA({
      registerType: "autoUpdate",
      strategies: 'generateSW',
      includeAssets: [
        'FLASHGPT_ICON.png',
        'FlashGPT.png',
        'offline.html',
      ],
      manifest: {
        id: '/',
        name: 'FlashGPT',
        short_name: 'FlashGPT',
        description: 'AI chat assistant with Google login, Gemini responses, and long-term memory.',
        theme_color: '#0b0f19',
        background_color: '#0d0f13',
        display: 'standalone',
        display_override: ['window-controls-overlay', 'standalone', 'minimal-ui'],
        scope: '/',
        start_url: '/chat/new',
        orientation: 'portrait-primary',
        categories: ['productivity', 'utilities'],
        icons: [
          {
            src: '/FLASHGPT_ICON.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'any maskable'
          },
          {
            src: '/FlashGPT.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable'
          }
        ],
        shortcuts: [
          {
            name: 'New Chat',
            short_name: 'New Chat',
            description: 'Start a new FlashGPT chat',
            url: '/chat/new',
            icons: [{ src: '/FLASHGPT_ICON.png', sizes: '192x192', type: 'image/png' }]
          },
          {
            name: 'Settings',
            short_name: 'Settings',
            description: 'Open FlashGPT settings',
            url: '/settings',
            icons: [{ src: '/FLASHGPT_ICON.png', sizes: '192x192', type: 'image/png' }]
          }
        ]
      },
      workbox: {
        cleanupOutdatedCaches: true,
        clientsClaim: true,
        skipWaiting: true,
        navigateFallback: '/',
        navigateFallbackDenylist: [/^\/auth\//, /^\/api\//],
        globPatterns: ['**/*.{js,css,html,ico,png,svg,webp,woff2}'],
        runtimeCaching: [
          {
            urlPattern: ({ url }) => url.origin === 'https://ik.imagekit.io',
            handler: 'CacheFirst',
            options: {
              cacheName: 'media-cache',
              expiration: { maxEntries: 20, maxAgeSeconds: 7 * 24 * 60 * 60 }
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
        enabled: false,
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
