import { join } from 'path';

export const PATH_NOTES = 'notes';
export const PATH_TIL = 'today-i-learned';
export const PATH_NOTES_FILE = 'f';
export const PATH_COMMENTS = 'comments';
export const PATH_EMOJIS = 'emojis';

export const BASE_URL = process.env.BASE_URL;
export const NOTE_FE_BASE_URL = process.env.NOTE_FE_BASE_URL;
export const NOTES_PUBLISHED_DIR = process.env.NOTES_PUBLISHED_DIR;
export const TILS_PUBLISHED_DIR = process.env.TILS_PUBLISHED_DIR;

export const FILE_DIR =
  process.env.FILE_DIR && process.env.FILE_DIR.startsWith('/')
    ? process.env.FILE_DIR
    : join(__dirname, process.env.FILE_DIR);

export const FILE_URL_PREFIX = process.env.FILE_URL_PREFIX;

export const TZ = process.env.TZ;
