import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'robots.txt'],
      manifest: {
        id: "/",
        name: 'Courses App',
        short_name: 'Courses',
        description: 'Learn anywhere, anytime with offline access!',
        theme_color: '#ffffff',
        screenshots: [
          {
            "src": "/screenshot.jpg",
            "sizes": "1920x1280",
            "type": "image/jpg",
            "form_factor": "wide"
          },
          {
            "src": "/screenshot1.jpg",
            "sizes": "1920x1280",
            "type": "image/jpg",
            "form_factor": "wide"
          },
          {
            "src": "/narrow.jpg",
            "sizes": "1280x1920",
            "type": "image/jpg",
            "form_factor": "narrow"
          },
        ],
        icons: [
          {
            src: '/square.jpg',
            sizes: '640x640',
            type: 'image/jpg'
          },
          {
            src: '/shePath.png',
            sizes: '499x500',
            type: 'image/png'
          }
        ],
        start_url: '/',
        display: 'standalone',
        background_color: '#ffffff'
      }
    })
  ],
});