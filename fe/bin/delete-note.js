const fs = require('fs');
const path = require('path');
const { loadEnv } = require('vite');
process.env = {...process.env, ...loadEnv('development', process.cwd())};
const args = process.argv.slice(2);

if (!fs.existsSync(process.env.VITE_APP_DEPLOY_DIR)) {
  throw new Error(`Maybe the VITE_APP_DEPLOY_DIR (${process.env.VITE_APP_DEPLOY_DIR}) is wrong or you forgot to deploy.`);
}

const note = args[0];
if (note) {
  const regexNoteFile = new RegExp(note + '\\.(\\w+)\\.js$');
  fs.readdir(process.env.VITE_APP_NOTE_DIR, (err, files) => {
    if (!files) {
      return;
    }
    files.forEach(file => {
        if(regexNoteFile.test(file)) {
          const filePath = path.join(process.env.VITE_APP_NOTE_DIR, file);
          try {
            fs.unlinkSync(filePath)
          } catch(e) {
            if (e.code !== 'ENOENT') {
              throw e;
            }
          }
        }
    });
  });

  // remove note's images
  const imagesFolder = path.join(process.env.VITE_APP_NOTE_IMG_DIR, note);
  try {
    fs.rmSync(imagesFolder, { recursive: true });
  } catch(e) {
    if (e.code !== 'ENOENT') {
      throw e;
    }
  }

  // rebuild note-chunk-map.js
  const noteChunkMapFile = `${process.env.VITE_APP_DEPLOY_DIR}/note-chunk-map.js`;
  require(noteChunkMapFile);

  delete __VP_HASH_MAP__[note];
  fs.writeFileSync(noteChunkMapFile, `__VP_HASH_MAP__ = ${JSON.stringify(__VP_HASH_MAP__)}`, );
}
