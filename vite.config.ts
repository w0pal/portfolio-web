import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from 'node:url'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  return {
    plugins: [vue()],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
    },
    server: {
      port: 5173,
      proxy: {
        '/api/medium/feed': {
          target: `https://medium.com/feed/@${env.VITE_MEDIUM_USERNAME || env.MEDIUM_USERNAME || 'mnaufalmaulana84'}`,
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api\/medium\/feed/, ''),
        },
        '/api': {
          target: 'http://localhost:3001',
          changeOrigin: true,
        },
      },
    },
  }
})
