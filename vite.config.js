import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import netlify from '@netlify/vite-plugin'   // <-- serverless functions support

export default defineConfig({
  plugins: [react(), tailwindcss(), netlify()],
})