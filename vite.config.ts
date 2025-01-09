import path from "path"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    proxy: {
      '/external': {
        target: "https://proiecttehnologiiweb-production.up.railway.app",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/external/, '')
      }
    },
  },
})

