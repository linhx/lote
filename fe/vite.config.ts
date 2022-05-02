import { defineConfig, Plugin } from 'vite';
import vue from '@vitejs/plugin-vue';
import { resolve } from 'path';
import fs from 'fs';
import { fileNameWithoutExtension } from './src/utilities/FileUtils';

const notes: { [name: string]: string } = {};
fs.readdirSync('./notes').forEach(file => {
  const noteName = fileNameWithoutExtension(file);
  notes['note-' + noteName] = resolve(__dirname, './notes', file);
});

const pageToHashMap = {};
const hashRE = /\.(\w+)\.js$/
const vitePressPlugin: Plugin = {
  name: 'note-chunk',

  generateBundle(_options, bundle) {
    for (const name in bundle) {
      const chunk = bundle[name]

      if (chunk.name.startsWith('note-')) {
        const hash = chunk.fileName.match(hashRE)![1]
        pageToHashMap![chunk.name.toLowerCase()] = hash
      }
    }
    fs.writeFileSync('./dist/note-chunk-map.js', `__VP_HASH_MAP__ = ${JSON.stringify(pageToHashMap)}`);
  },
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue(), vitePressPlugin],
  build: {
    rollupOptions: {
      input: {
        ...notes,
        app: resolve(__dirname, 'index.html'),
        'vue-modules': resolve(__dirname, 'src/vue-modules.ts')
      },
      preserveEntrySignatures: "allow-extension",
    }
  },
  server: {
    port: 3002,
    host: '0.0.0.0',
    watch: {
      usePolling: true
    }
  }
})
