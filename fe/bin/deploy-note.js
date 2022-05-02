const fs = require('fs-extra');
const { loadEnv } = require('vite');
process.env = {...process.env, ...loadEnv('development', process.cwd())};

fs.copySync('./dist', process.env.VITE_APP_DEPLOY_DIR, { overwrite: true });
