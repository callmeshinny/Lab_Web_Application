import { defineConfig } from 'vite'

// Vite config tuned for this custom JSX runtime
export default defineConfig({
  esbuild: {
    // Ensure TSX uses our createElement factory
    jsxFactory: 'createElement',
    jsxFragment: 'createFragment',
  },
  server: {
    port: 5173,
    open: false,
  },
  build: {
    target: 'es2020',
    sourcemap: true,
  }
})
