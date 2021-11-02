import { join } from 'path';

export const STATIC_FOLDER = process.env.STATIC_FOLDER.startsWith('/')
  ? process.env.STATIC_FOLDER
  : join(__dirname, process.env.STATIC_FOLDER);
export const NOTE_DATA_FOLDER = join(STATIC_FOLDER, 'note');

export const FILE_TEMP_FOLDER = process.env.FILE_TEMP_FOLDER && process.env.FILE_TEMP_FOLDER.startsWith('/')
  ? process.env.FILE_TEMP_FOLDER
  : join(__dirname, process.env.FILE_TEMP_FOLDER);
