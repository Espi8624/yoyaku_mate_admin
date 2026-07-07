import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [react()],
    server: {
      proxy: {
        // 開発環境: /proxy-dev/* → VITE_PROXY_DEV_TARGET/api/admin/*
        // VITE_PROXY_DEV_TARGET は .env.development に必ず設定してください
        '/proxy-dev': {
          target: env.VITE_PROXY_DEV_TARGET,
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/proxy-dev/, '/api/admin'),
        },
        // 本番環境: /proxy-prod/* → VITE_PROXY_PROD_TARGET/api/admin/*
        // VITE_PROXY_PROD_TARGET は .env.production に必ず設定してください
        '/proxy-prod': {
          target: env.VITE_PROXY_PROD_TARGET,
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/proxy-prod/, '/api/admin'),
        },
      },
    },
  }
})

