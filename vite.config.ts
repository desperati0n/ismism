import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  // 如果仓库名为 ismism（项目页），请保留 base；若为用户页仓库，可改为 '/'。
  base: '/ismism/',
  plugins: [react()],
})

