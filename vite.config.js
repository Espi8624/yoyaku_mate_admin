import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // 開発環境: /proxy-dev/* → https://rusui-dev.fly.dev/api/admin/*
      '/proxy-dev': {
        target: 'https://rusui-dev.fly.dev',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/proxy-dev/, '/api/admin'),
      },
      // 本番環境: /proxy-prod/* → https://rusui-prod.fly.dev/api/admin/*
      '/proxy-prod': {
        target: 'https://rusui-prod.fly.dev',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/proxy-prod/, '/api/admin'),
      },
    },
  },
})

