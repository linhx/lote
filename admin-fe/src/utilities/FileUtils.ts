import { nanoid } from 'nanoid';

export const randomFileName = (ext: string) => {
  return nanoid() + '.' + ext;
};

export const urltoFile = (url: string, filename: string, mimeType: string) => {
  return (fetch(url)
      .then(function(res){return res.arrayBuffer();})
      .then(function(buf){return new File([buf], filename,{type:mimeType});})
  );
}

export function fileNameWithoutExtension(fileName: string) {
  if (!fileName) return fileName;
  if (fileName.indexOf('.') === -1) return fileName;
  return fileName.split('.').slice(0, -1).join('.');
}
