const fs = require('fs-extra');
const path = require('path');
const fileUtils = require('./FileUtils');
const { loadEnv } = require('vite');
const updateNotChunkMapVer = require('./UpdateNotChunkMapVer');
process.env = {...process.env, ...loadEnv('development', process.cwd())};

if (fs.existsSync(process.env.VITE_APP_DEPLOY_DIR)) {
  const files = fs.readdirSync(process.env.VITE_APP_DEPLOY_DIR);
  files.forEach(file => {
    const filePath = path.join(process.env.VITE_APP_DEPLOY_DIR, file);
    if (filePath === process.env.VITE_APP_NOTE_DIR ||
      filePath === process.env.VITE_APP_NOTE_IMG_DIR) {
        return;
      }
    fileUtils.rmSyncSilent(filePath, { recursive: true });
  });
} else {
  fs.mkdirSync(process.env.VITE_APP_DEPLOY_DIR, { recursive: true });
}
fs.copySync('./dist', process.env.VITE_APP_DEPLOY_DIR, { overwrite: true });
updateNotChunkMapVer.update(`${process.env.VITE_APP_DEPLOY_DIR}/index.html`);
