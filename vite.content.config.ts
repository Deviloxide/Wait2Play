import { defineConfig } from 'vite';
import { fileURLToPath } from 'node:url';

const r = (p: string) => fileURLToPath(new URL(p, import.meta.url));

/**
 * Pass 2: the content script, bundled as a single self-contained IIFE
 * (MV3 content scripts cannot use ES module imports). Runs after pass 1
 * and must not wipe dist/.
 */
export default defineConfig({
  publicDir: false,
  build: {
    outDir: r('./dist'),
    emptyOutDir: false,
    target: 'chrome110',
    sourcemap: false,
    lib: {
      entry: r('./src/content/index.ts'),
      formats: ['iife'],
      name: 'Wait2PlayContent',
      fileName: () => 'content.js',
    },
  },
});
