import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    allowedHosts: [
      'donasiku-webpro-production.up.railway.app',
      'donasiku.site',
      'www.donasiku.site',
      '.railway.app',
      'localhost'
    ],
    watch: {
      usePolling: true,
    },
  },
})
