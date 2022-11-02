import vue from '@vitejs/plugin-vue';
import { resolve } from 'path';
import fs from 'fs';
import chokidar from 'chokidar';
import { fileNameWithoutExtension } from './src/utilities/FileUtils';
import { loadEnv } from 'vite';

const NOTES_INDEX = './notes/index.ts';
/**
 * create this module for dev mode. check fe/src/router/index.ts
 */
const updateNotesIndex = () => {
  const files = fs.readdirSync(`./notes`);

  const notes = files
    .filter(f => f.endsWith('.vue'))
    .map(file => ({
        moduleName: file.replace(/-|\./g, '$'),
        name: fileNameWithoutExtension(file),
        file
      }));

  const imports = notes.map(n => `import ${n.moduleName} from './${n.file}'`).join('\n');
  const exports = notes.map(n => `'${n.name}': ${n.moduleName}`).join(',\n');

  const index = `${imports}\nexport default {\n${exports}\n}`;

  fs.writeFileSync(NOTES_INDEX, index, {
    encoding: 'utf8',
    flag: 'w',
  });
}


const BUILD_DIR = './dist'; // TODO
const indexHtmlFilePath = `${BUILD_DIR}/index.html`;

/**
 * add vue-modules to index.html to load vue-modules chunk at first
 */
function addVueModulesToIndexPlugin() {
  return {
    name: 'add-vue-modules-to-index',
    closeBundle() {
      let indexHtml = fs.readFileSync(indexHtmlFilePath, { encoding: 'utf8' });
      const files = fs.readdirSync(`${BUILD_DIR}/assets`);
      let vueModule;
      for (const file of files) {
        if (file.startsWith('vue-modules')) {
          vueModule = file;
          break;
        }
      }
      if (vueModule) {
        const vendorLinkRegex =
          /<link rel="modulepreload" href=".+\/vendor\.\w+\.js">/;
        const vendorLinkExec = vendorLinkRegex.exec(indexHtml);
        if (vendorLinkExec) {
          const vendorLink = vendorLinkExec.at(0);
          const indexWithVueModuleChunk =
            indexHtml.slice(0, vendorLinkExec.index + vendorLink.length) +
            `\n<link rel="modulepreload" href="/assets/${vueModule}">` +
            indexHtml.slice(vendorLinkExec.index + vendorLink.length);

          fs.writeFileSync(indexHtmlFilePath, indexWithVueModuleChunk, {
            encoding: 'utf8',
            flag: 'w',
          });
        }
      }
    },
  };
}

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
  if (mode === 'development') {
    updateNotesIndex();
    chokidar.watch('./notes')
    .on('add', () => {
      updateNotesIndex();
    })
    .on('unlink', () => {
      updateNotesIndex();
    });
  }

  return {
    plugins: [vue(), htmlPlugin(loadEnv(mode, process.cwd())), addVueModulesToIndexPlugin()],
    build: {
      rollupOptions: {
        input: {
          app: resolve(__dirname, 'index.html'),
          'vue-modules': resolve(__dirname, 'src/vue-modules.ts'),
        },
        preserveEntrySignatures: 'allow-extension',
      },
    },
    server: {
      port: 3002,
      host: '0.0.0.0',
      watch: {
        usePolling: true,
      },
    },
  }
}
