import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Local development configuration
export default defineConfig({
  plugins: [
    react(),
  ],
  server: {
    port: 3000,
    host: '127.0.0.1', // localhost only
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:5000',
        changeOrigin: true,
        secure: false,
      }
    }
  },
  build: {
    outDir: 'dist',
    sourcemap: false, // Disable sourcemaps for simpler builds
  }
})