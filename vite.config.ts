import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'prompt',
      includeAssets: ['favicon.svg', 'brand/logo.png'],
      manifest: {
        name: 'The Biriyani Store',
        short_name: 'Biriyani Store',
        description: 'Authentic flavors. Timeless legacy. Order biriyani from Kochi since 1975.',
        theme_color: '#DCE4D3',
        background_color: '#F2F5E8',
        display: 'standalone',
        orientation: 'portrait',
        scope: '/',
        start_url: '/',
        icons: [
          {
            src: '/brand/logo.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any',
          },
          {
            src: '/brand/logo.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable',
          },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,jpg,woff2}'],
        cleanupOutdatedCaches: true,
        navigateFallback: '/index.html',
        // Match SPA routes including query strings (e.g. /home?_mvua=1 from Vite dev).
        navigateFallbackAllowlist: [/^\/[^.]*$/],
      },
      devOptions: {
        enabled: true,
      },
    }),
  ],
})
