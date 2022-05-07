const fs = require('fs');

exports.update = (indexHtmlFilePath) => {
  let indexHtml = fs.readFileSync(indexHtmlFilePath, { encoding: 'utf8' });
  indexHtml = indexHtml.replace(/src="\/note-chunk-map.js.*"/, `src="/note-chunk-map.js?v=${new Date().getTime()}"`);
  fs.writeFileSync(indexHtmlFilePath, indexHtml, {
    encoding: 'utf8',
    flag: 'w'
  });
}