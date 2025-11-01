import { defineConfig } from 'vite'

export default defineConfig({
  base: './', 
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    rollupOptions: {
      input: './index.html',
    },
  },
  esbuild: {
    jsxFactory: 'createElement',
    jsxFragment: 'Fragment',
  },
  server: {
    port: 5174,
  },
})
