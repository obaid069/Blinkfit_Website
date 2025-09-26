import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:5001',
        changeOrigin: true,
        secure: false,
      },
    },
    // Allow unsafe-eval for development (needed for React DevTools and HMR)
    headers: {
      'Content-Security-Policy': "script-src 'self' 'unsafe-eval' 'unsafe-inline'; object-src 'none';"
    }
  },
  // Ensure dev build allows eval for React DevTools
  define: {
    global: 'globalThis',
  },
  // Optimize dependencies that might use eval
  optimizeDeps: {
    include: ['react', 'react-dom']
  }
})
