import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { resolve } from 'path';
import fs from 'fs';
import { fileNameWithoutExtension } from './src/utilities/FileUtils';

const notes: { [name: string]: string } = {};
fs.readdirSync('./notes').forEach(file => {
  const noteName = fileNameWithoutExtension(file);
  notes[noteName] = resolve(__dirname, './notes', file);
});

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  build: {
    rollupOptions: {
      input: {
        ...notes,
        app: resolve(__dirname, 'index.html')
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
