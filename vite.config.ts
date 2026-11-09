import { defineConfig } from 'vite';
import { fileURLToPath } from 'node:url';

const r = (p: string) => fileURLToPath(new URL(p, import.meta.url));

/**
 * Pass 1: extension pages (popup, options) + background service worker.
 * All emitted as ES modules; the service worker is declared with "type": "module".
 * The content script is built separately (vite.content.config.ts) because MV3
 * content scripts cannot be ES modules.
 */
export default defineConfig({
  root: r('./src'),
  publicDir: r('./public'),
  base: './',
  build: {
    outDir: r('./dist'),
    emptyOutDir: true,
    target: 'chrome110',
    modulePreload: false,
    sourcemap: false,
    rollupOptions: {
      input: {
        popup: r('./src/popup/index.html'),
        options: r('./src/options/index.html'),
        background: r('./src/background/index.ts'),
      },
      output: {
        entryFileNames: (chunk) => (chunk.name === 'background' ? 'background.js' : 'assets/[name]-[hash].js'),
        chunkFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash][extname]',
      },
    },
  },
});
