import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  // 自定义域名直达根路径，base 必须为 '/'
  base: '/',
  plugins: [react()],
})

