const fs = require('fs-extra');
const path = require('path');
const { loadEnv } = require('vite');
const fileUtils = require('./FileUtils');
const updateNotChunkMapVer = require('./UpdateNotChunkMapVer');
process.env = {...process.env, ...loadEnv('development', process.cwd())};

fileUtils.rmSyncSilent(process.env.VITE_APP_NOTE_DIR, { recursive: true });
fileUtils.rmSyncSilent(process.env.VITE_APP_NOTE_IMG_DIR, { recursive: true });
fileUtils.copySyncSilent('./dist/notes', process.env.VITE_APP_NOTE_DIR, { overwrite: true });
fileUtils.copySyncSilent('./dist/note-img', process.env.VITE_APP_NOTE_IMG_DIR, { overwrite: true });
fs.copySync('./dist/note-chunk-map.js', path.join(process.env.VITE_APP_DEPLOY_DIR, 'note-chunk-map.js'), { overwrite: true });
updateNotChunkMapVer.update(`${process.env.VITE_APP_DEPLOY_DIR}/index.html`);
