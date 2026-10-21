import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { projects } from './plugins/projects.ts'

export default defineConfig({
  plugins: [react(), tailwindcss(), projects(fileURLToPath(new URL('./src/content/projects', import.meta.url)))],
})
