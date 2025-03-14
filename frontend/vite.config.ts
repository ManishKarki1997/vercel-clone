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
    host: '0.0.0.0',
    port: process.env.VITE_APP_SERVER_PORT ? Number(process.env.VITE_APP_SERVER_PORT) : 5173,
  },
  preview: {
    allowedHosts: ['vercel.manishkarki.com'],
    host: '0.0.0.0',
    port: 8999
  }
})
