import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [svelte()],
  base: './', // This is important for GitHub Pages deployment
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    minify: 'terser',
    terserOptions: {
      compress: {
        // Remove console logs in production
        drop_console: true,
        drop_debugger: true,
      },
    },
  },
  esbuild: {
    // Remove console logs during development build as well if needed
    drop: process.env.NODE_ENV === 'production' ? ['console', 'debugger'] : [],
  },
});