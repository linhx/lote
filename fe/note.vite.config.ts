import { defineConfig, loadEnv, Plugin } from 'vite';
import vue from '@vitejs/plugin-vue';
import { join, resolve } from 'path';
import fs from 'fs';
import { fileNameWithoutExtension } from './src/utilities/FileUtils';
const OUT_DIR = './dist-note';

const notes: { [name: string]: string } = {};
fs.readdirSync('./notes').forEach(file => {
  const noteName = fileNameWithoutExtension(file);
  notes['note-' + noteName] = resolve(__dirname, './notes', file);
});

const pageToHashMap = {};
const hashRE = /\.(\w+)\.js$/;
const vitePressPlugin: Plugin = {
  name: 'note-chunk',

  generateBundle(_options, bundle) {
    for (const name in bundle) {
      const chunk = bundle[name];

      if (chunk.name.startsWith('note-')) {
        const hash = chunk.fileName.match(hashRE)![1];
        pageToHashMap![chunk.name.toLowerCase()] = hash;
      }
    }
    if (!fs.existsSync(OUT_DIR)) {
      fs.mkdirSync(OUT_DIR);
    }
    fs.writeFileSync(`${OUT_DIR}/note-chunk-map.js`, `__VP_HASH_MAP__ = ${JSON.stringify(pageToHashMap)}`, );
  },
}

const getVueModulesFile = (deployDir) => {
  const assetsDir = deployDir.startsWith('/') ? join(deployDir, 'assets') : join(__dirname, deployDir, 'assets');
  if (!fs.existsSync(assetsDir)){
    throw new Error('assetsDir does not exist. Maybe the DEPLOY_DIR is wrong or you forgot to build the entire project and deploy.');
  }

  const files = fs.readdirSync(assetsDir);
  for (const file of files) {
    if (file.startsWith('vue-modules')) {
      return file;
    }
  }
  throw new Error('Maybe the DEPLOY_DIR is wrong or you forgot to build the entire project and deploy.');
}

export default ({ mode }) => {
  process.env = {...process.env, ...loadEnv(mode, process.cwd())};
  const vueModulesFile = getVueModulesFile(process.env.VITE_APP_DEPLOY_DIR);

  const vueModuluesPlugin: Plugin = {
    name: 'vue-modules',
    renderChunk: (code: string, chunk, options) => {
      if (code) {
        return code.replace('from \'vue\'', `from '${vueModulesFile}'`);
      }
    }
  }

  return defineConfig({
    plugins: [vue(), vueModuluesPlugin, vitePressPlugin],
    build: {
      outDir: OUT_DIR,
      assetsDir: 'notes',
      rollupOptions: {
        external: ['vue'],
        input: {
          ...notes
        },
        preserveEntrySignatures: "allow-extension",
      }
    }
  });
}
