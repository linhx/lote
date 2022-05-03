const fs = require('fs-extra');
const path = require('path');
const fileUtils = require('./FileUtils');
const { loadEnv } = require('vite');
process.env = {...process.env, ...loadEnv('development', process.cwd())};

if (fs.existsSync(process.env.VITE_APP_DEPLOY_DIR)) {
  const files = fs.readdirSync(process.env.VITE_APP_DEPLOY_DIR);
  files.forEach(file => {
    const filePath = path.join(process.env.VITE_APP_DEPLOY_DIR, file);
    fileUtils.rmSyncSilent(filePath, { recursive: true });
  });
} else {
  fs.mkdirSync(process.env.VITE_APP_DEPLOY_DIR, { recursive: true });
}
fs.copySync('./dist', process.env.VITE_APP_DEPLOY_DIR, { overwrite: true });
updateNotChunkMapVer.update(`${process.env.VITE_APP_DEPLOY_DIR}/index.html`);
