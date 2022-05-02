const fs = require('fs-extra');
const { loadEnv } = require('vite');
process.env = {...process.env, ...loadEnv('development', process.cwd())};

if (fs.existsSync(process.env.VITE_APP_DEPLOY_DIR)) {
  fs.readdir(process.env.VITE_APP_DEPLOY_DIR, (err, files) => {
    if (!files) {
      return;
    }
    files.forEach(file => {
      try {
        fs.rmSync(file, { recursive: true });
      } catch(e) {
        if (e.code !== 'ENOENT') {
          throw e;
        }
      }
    });
  });
} else {
  fs.mkdirSync(process.env.VITE_APP_DEPLOY_DIR, { recursive: true });
}
fs.copySync('./dist', process.env.VITE_APP_DEPLOY_DIR, { overwrite: true });
