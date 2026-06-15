import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": "/src",
    },
  },
  server: {
    proxy: {
      '/api/proxy/messages': {
        target: 'https://api.talesandtreasures.com.ng/messages',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/proxy\/messages/, '')
      },
      '/api/proxy/newsletter': {
        target: 'https://talesandtreasures-backend-production.up.railway.app/api/newsletter/subscribe',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/proxy\/newsletter/, '')
      }
    }
  }
});
