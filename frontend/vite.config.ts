import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  // Porta fixa: é a origem que o backend libera no CORS
  server: {
    port: 5173,
    strictPort: true,
  },
})
