import { defineConfig } from 'vite'
import { readFileSync, writeFileSync } from 'node:fs'
import { resolve } from 'node:path'
import react from '@vitejs/plugin-react'

// GitHub Pages SPA fallback: emit dist/404.html so deep routes like /#about load the app
function ghPagesSpaFallback() {
  return {
    name: 'gh-pages-spa-fallback',
    closeBundle() {
      const dist = resolve(import.meta.dirname, 'dist')
      writeFileSync(resolve(dist, '404.html'), readFileSync(resolve(dist, 'index.html')))
    },
  }
}

export default defineConfig({
  plugins: [react(), ghPagesSpaFallback()],
  build: {
    target: 'es2019',
    cssMinify: true,
    modulePreload: { polyfill: false },
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          /* React core — smallest chunk, loaded first */
          if (id.includes('node_modules/react/') || id.includes('node_modules/react-dom/')) {
            return 'react';
          }
          /* React Router */
          if (id.includes('node_modules/react-router') || id.includes('node_modules/react-router-dom')) {
            return 'router';
          }
          /* GSAP animation library — only pulled in by lazy below-fold
             sections via utils/anim.js dynamic import, never initial */
          if (id.includes('node_modules/gsap')) {
            return 'gsap';
          }
        },
      },
    },
    /* Raise chunk warning limit slightly — Engineering OS modules are intentionally split */
    chunkSizeWarningLimit: 600,
  },
})
