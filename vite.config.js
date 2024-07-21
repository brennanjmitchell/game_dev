import { defineConfig } from 'vite';

export default defineConfig({
  server: {
    open: true,
    watch: {
      usePolling: true
    }
  },
  optimizeDeps: {
    include: ['three'], // Pre-bundle dependencies for faster startup
  },
});