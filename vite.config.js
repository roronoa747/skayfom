import { defineConfig } from 'vite';

export default defineConfig({
  base: '/skayfom/', // Use absolute base path for GitHub Pages
  server: {
    port: 5173,
    open: true,
    watch: {
      ignored: ['**/downloaded_catalog.csv']
    }
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: true,
    emptyOutDir: true
  }
});
