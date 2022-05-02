import { nanoid } from 'nanoid';
import * as fs from 'fs';
import path from 'path';

export const getExt = (name: string) => {
  return name?.substring(name?.lastIndexOf('.') + 1);
};

export const randomFileName = (fileName: string) => {
  return nanoid() + '.' + getExt(fileName);
};

export const unlinkSyncSilentEnoent = (filePath: string) => {
  try {
    fs.unlinkSync(filePath)
  } catch(e: any) {
    if (e.code !== 'ENOENT') {
      throw e;
    }
  }
}

export const rmSyncSilentEnoent = (dir: string, options: fs.RmOptions) => {
  try {
    fs.rmSync(dir, options);
  } catch(e: any) {
    if (e.code !== 'ENOENT') {
      throw e;
    }
  }
}

type WriteFileOptions = fs.WriteFileOptions & { recursive?: boolean };
export const writeFileSync = (file: string, data: string | NodeJS.ArrayBufferView, options?: WriteFileOptions) => {
  if (options.recursive) {
    const dir = path.dirname(file);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  }
  fs.writeFileSync(file, data, options);
}
