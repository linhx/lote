import { defineConfig, loadEnv, Plugin } from 'vite';
import vue from '@vitejs/plugin-vue';
import { join, resolve } from 'path';
import fs from 'fs';
import { fileNameWithoutExtension } from './src/utilities/FileUtils';
declare const __VP_HASH_MAP__: Record<string, string>;
const OUT_DIR = './dist';
const MODE_BUILD = 'build';
const MODE_BUILD_NOTES = 'build-notes';
const MODE_BUILD_SINGLE_NOTE = 'build-single-note';

const getNotesRollupInput = (noteDir) => {
  const notes: { [name: string]: string } = {};

  try {
    fs.readdirSync(noteDir).forEach(file => {
      if (file.endsWith('.vue')) {
        const noteName = fileNameWithoutExtension(file);
        notes[noteName] = resolve(__dirname, noteDir, file);
      }
    });
  } catch (e) {
    if (e.code !== 'ENOENT') {
      throw e;
    }
  }

  return notes;
}

const hashRE = /\.(\w+)\.js$/;
const vitePressPlugin = ({
  env
}): Plugin => {
  const reCreateNoteChunkMap = env.BUILD_MODE === MODE_BUILD || env.BUILD_MODE === MODE_BUILD_NOTES;
  const deployDir = env.VITE_APP_DEPLOY_DIR;
  let pageToHashMap = {};
  if (!reCreateNoteChunkMap) {
    try {
      // read the current __VP_HASH_MAP__ in the `fe` deployed dir
      require(`${deployDir}/note-chunk-map.js`);
      pageToHashMap = __VP_HASH_MAP__ || {};
    } catch(e) {
      // do nothing
    }
  }

  return {
    name: 'note-chunk',
    generateBundle(_options, bundle) {
      for (const name in bundle) {
        const chunk = bundle[name];
  
        const hash = chunk.fileName.match(hashRE)![1];
        pageToHashMap![chunk.name] = hash;
      }
      if (!fs.existsSync(OUT_DIR)) {
        fs.mkdirSync(OUT_DIR);
      }
      fs.writeFileSync(`${OUT_DIR}/note-chunk-map.js`, `__VP_HASH_MAP__ = ${JSON.stringify(pageToHashMap)}`, );
    }
  }
}


const getVueModulesFile = (deployDir) => {
  const assetsDir = deployDir.startsWith('/') ? join(deployDir, 'assets') : join(__dirname, deployDir, 'assets');
  if (!fs.existsSync(assetsDir)){
    throw new Error(`${assetsDir} does not exist. Maybe the DEPLOY_DIR is wrong or you forgot to build the entire project and deploy.`);
  }

  const files = fs.readdirSync(assetsDir);
  for (const file of files) {
    if (file.startsWith('vue-modules')) {
      return file;
    }
  }
  throw new Error(`Maybe the DEPLOY_DIR (${assetsDir}) is wrong or you forgot to build the entire project and deploy.`);
}

/**
 * reuse the built vendor modules instead of build a new one.
 * by make `vue` as external, and create `src/vue-modules.ts` to keep the original modules name.
 * Then replace `vue` by the vue-modules.ts's built file.
 * 
 * TODO do the same for 'plugin-vue:export-helper' - a module from @vitejs/plugin-vue
 * 
 * @param config config
 * @returns 
 */
const vueModuluesPlugin = ({ env }) => {
  let distDir;
  switch(process.env.BUILD_MODE) {
    case MODE_BUILD_NOTES:
    case MODE_BUILD_SINGLE_NOTE:
      // get the vue-modules.ts's built file in deployed directory
      distDir = process.env.VITE_APP_DEPLOY_DIR;
      break;
    case MODE_BUILD:
      // get the vue-modules.ts's built file in the the directory just finished building
      distDir = OUT_DIR;
      break;
    default:
      distDir = OUT_DIR;
      break;
  }
  const vueModulesFile = getVueModulesFile(distDir);

  return {
    name: 'vue-modules',
    renderChunk: (code: string, chunk, options) => {
      if (code) {
        return code.replace('from \'vue\'', `from '/assets/${vueModulesFile}'`)
        // .replace(`import _export_sfc from 'plugin-vue:export-helper'`, `export default (sfc,props)=>{for(const [key,val] of props){sfc[key]=val}return sfc;}`);
      }
    }
  }
}

/**
 * modify edit so vue plugin doesn't split `plugin-vue:export-helper` into a separate chunk 
 * to avoid crashing when internet connection is lost.
 * 
 * The problem is:
 * 1. Loaded page (include prefetch Note's chunks)
 * 2. Disconnect internet
 * 3. Click to one Note, the Note chunk is able to load because it was prefetched.
 * 4. The Note chunk imports `plugin-vue:export-helper` <-- error here because the internet is disconnected, the helper can't be loaded
 * 
 * DANGER!!!
 * This treatment is temporary. Vue plugin can be updated at any time (e.g. change the helper name or change the helper code).
 * Or maybe Vue plugin will adds another helper, who knows?
 * I've been trying to figure out how to set Rollupjs to not split chunks. but it seems Rollupjs doesn't support it yet.
 */
const vuePluginDoesSplitExportHelper = () => {
  // this code is from node_modules/@vitejs/plugin-vue/dist/index.js
  var helperCode = `
  const _export_sfc = (sfc, props) => {
    for (const [key, val] of props) {
      sfc[key] = val
    }
    return sfc
  }
  `;
  const plugin = vue();
  const transform = plugin.transform;
  plugin.transform = function(code, id, ssr) {
    return transform.apply(this, [code, id, ssr])?.then(res => {
      const code =  res?.code.replace(`import _export_sfc from "plugin-vue:export-helper"`, helperCode);
      return {
        ...res,
        code
      }
    });
  }
  return plugin;
}

export default ({ mode }) => {
  process.env = {...process.env, ...loadEnv(mode, process.cwd())};

  let noteDir;
  let publicDir;
  if (process.env.BUILD_MODE === MODE_BUILD_SINGLE_NOTE) {
    noteDir = './single-note';
    publicDir = noteDir + '/img';
  } else {
    noteDir = './notes';
    publicDir = './public';
  }
  const notes = getNotesRollupInput(noteDir);

  return defineConfig({
    plugins: [
      vuePluginDoesSplitExportHelper(),
      vueModuluesPlugin({ env: process.env }),
      vitePressPlugin({ env: process.env })
    ],
    publicDir, // take the advantage of publicDir to copy the static images
    build: {
      outDir: OUT_DIR,
      assetsDir: 'notes',
      rollupOptions: {
        external: ['vue'],
        input: {
          ...notes,
          dummy: './dummy.js' // avoid error if rollup input is empty when there are no notes
        },
        preserveEntrySignatures: "allow-extension",
      }
    }
  });
}
