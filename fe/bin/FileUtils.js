const fs = require('fs-extra');

exports.rmSyncSilent = (path, options) => {
  try {
    fs.rmSync(path, options);
  } catch(e) {
    if (e.code !== 'ENOENT') {
      throw e;
    }
  }
}

exports.copySyncSilent = (src, dest, options) => {
  try {
    fs.copySync(src, dest, options);
  } catch(e) {
    if (e.code !== 'ENOENT') {
      throw e;
    }
  }
}
