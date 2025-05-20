import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [svelte()],
  base: './', // This is important for GitHub Pages deployment
  build: {
    outDir: 'dist',
    emptyOutDir: true
  }
});