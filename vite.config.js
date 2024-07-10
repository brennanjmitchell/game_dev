import { defineConfig } from 'vite';

export default defineConfig({
  server: {
    open: true,
  },
  optimizeDeps: {
    include: ['three'], // Pre-bundle dependencies for faster startup
  },
});