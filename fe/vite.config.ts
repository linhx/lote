import vue from '@vitejs/plugin-vue';
import { loadEnv } from 'vite';

/**
 * Replace env variables in index.html
 * @see https://github.com/vitejs/vite/issues/3105#issuecomment-939703781
 * @see https://vitejs.dev/guide/api-plugin.html#transformindexhtml
 */
 function htmlPlugin(env: ReturnType<typeof loadEnv>) {
  env.CURRENT_TIMESTAMP = '' + new Date().getTime();
  return {
    name: 'html-transform',
    transformIndexHtml: {
      enforce: 'pre' as const,
      transform: (html: string): string =>
        html.replace(/<%=(.*?)%>/g, (match, p1) =>
          env[p1] ?? match
        ),
    }
  }
}

export default ({ mode }) => {
  return {
    plugins: [vue(), htmlPlugin(loadEnv(mode, process.cwd()))],
    server: {
      port: 3002,
      host: '0.0.0.0',
      watch: {
        usePolling: true,
      },
    },
  }
}
