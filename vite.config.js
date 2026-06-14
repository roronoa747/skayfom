import { defineConfig } from 'vite';

export default defineConfig({
  base: '/skayfom/', // Replace with your repository name for GitHub Pages
  server: {
    port: 5173,
    open: true
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: true,
    emptyOutDir: true
  }
});
