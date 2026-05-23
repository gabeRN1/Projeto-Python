import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0', // Permite que o Docker exponha a porta
    port: 5173,
    watch: {
      usePolling: true, // Força o Hot Reload no Docker
    }
  }
})