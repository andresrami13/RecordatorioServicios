import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'
import { readFileSync } from 'fs'

const { version } = JSON.parse(readFileSync('./package.json', 'utf8'))

export default defineConfig({
  // Inyecta la versión del package.json como constante global en tiempo de build
  define: {
    __APP_VERSION__: JSON.stringify(version),
  },

  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['icons/icon-192.png', 'icons/icon-512.png', 'icons/icon-maskable.png'],
      manifest: {
        name: 'Mis Recibos',
        short_name: 'MisRecibos',
        description: 'Gestiona y controla tus recibos de servicios',
        theme_color: '#764ba2',
        background_color: '#0f0f1a',
        display: 'standalone',
        orientation: 'portrait',
        scope: '/',
        start_url: '/',
        icons: [
          {
            // Ícono regular — se usa en splash screens y navegadores
            src: '/icons/icon-192.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'any'
          },
          {
            src: '/icons/icon-512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any'
          },
          {
            // Ícono maskable — Android lo recorta en círculo/squircle
            // Fondo full-bleed, rayo dentro de la zona segura (80 %)
            src: '/icons/icon-maskable.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable'
          }
        ]
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg}'],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/script\.google\.com\/.*/i,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'api-cache',
              expiration: { maxEntries: 10, maxAgeSeconds: 300 }
            }
          }
        ]
      }
    })
  ]
})
