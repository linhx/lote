import { nanoid } from 'nanoid';
import * as fs from 'fs';

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
