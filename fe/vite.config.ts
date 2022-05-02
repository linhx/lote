import { defineConfig, Plugin } from 'vite';
import vue from '@vitejs/plugin-vue';
import { resolve } from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  build: {
    rollupOptions: {
      input: {
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
});
