import { nanoid } from 'nanoid';
import * as fs from 'fs';
import * as path from 'path';

export const getExt = (name: string) => {
  return name?.substring(name?.lastIndexOf('.') + 1);
};

export const fileNameWithoutExtension = (fileName: string) => {
  if (!fileName) return fileName;
  const lastIndexOfDot = fileName.lastIndexOf('.');
  if (lastIndexOfDot === -1) {
    return fileName;
  }
  return fileName.substring(0, lastIndexOfDot);
}

export const createValidPath = (str: string) => {
  return str?.replace(/[^a-zA-Z0-9_]/g, '-');
}

export const randomFileName = (fileName: string) => {
  return nanoid() + '.' + getExt(fileName);
};

export const unlinkSyncSilentEnoent = (filePath: string) => {
  try {
    fs.unlinkSync(filePath);
  } catch (e: any) {
    if (e.code !== 'ENOENT') {
      throw e;
    }
  }
};

export const rmSyncSilentEnoent = (dir: string, options: fs.RmOptions) => {
  try {
    fs.rmSync(dir, options);
  } catch (e: any) {
    if (e.code !== 'ENOENT') {
      throw e;
    }
  }
};

type WriteFileOptions = fs.WriteFileOptions & { recursive?: boolean };
export const writeFileSync = (
  file: string,
  data: string | NodeJS.ArrayBufferView,
  options?: WriteFileOptions,
) => {
  if (options && options.recursive) {
    const dir = path.dirname(file);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  }
  fs.writeFileSync(file, data, options);
};

export const rmSyncInsideSilentEnoent = (
  dir: string,
  options?: fs.RmOptions,
) => {
  try {
    const files = fs.readdirSync(dir);
    for (const file of files) {
      const filePath = path.join(dir, file);
      fs.rmSync(filePath, options);
    }
  } catch (e: any) {
    if (e.code !== 'ENOENT') {
      throw e;
    }
  }
};

export const mkdirSyncIfNotExist = (path: string, options: fs.MakeDirectoryOptions & {
  recursive: true;
}) => {
  if (!fs.existsSync(path)) {
    fs.mkdirSync(path, options)
  }
}

export const mvSync = (source: string, dest: string) => {
  fs.renameSync(source, dest);
}
