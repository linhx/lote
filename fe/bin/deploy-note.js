const fs = require('fs-extra');
const { loadEnv } = require('vite');
const fileUtils = require('./FileUtils');
process.env = {...process.env, ...loadEnv('development', process.cwd())};

const newNotes = fs.readdirSync(process.env.VITE_APP_NOTE_DIR);
const oldNotes = fs.readdirSync(process.env.VITE_APP_DEPLOY_DIR);
if (oldNotes) {
  for (const newNote in newNotes) {
    const noteName = newNote.replace(/\.(\w+)\.js$/, '');
    const regexNoteFile = new RegExp(noteName + '\\.(\\w+)\\.js$');
    oldNotes.forEach(file => {
      if(regexNoteFile.test(file)) {
        const filePath = path.join(process.env.VITE_APP_DEPLOY_DIR, file);
        fileUtils.rmSyncSilent(filePath);
      }
    });
  }
}

fs.copySync('./dist', process.env.VITE_APP_DEPLOY_DIR, { overwrite: true });
