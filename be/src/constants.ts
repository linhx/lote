import { join } from 'path';
import * as StringUtils from './utilites/StringUtils';

export const PATH_NOTES = 'notes';
export const PATH_NOTES_FILE = 'f';

export const NOTE_FE_BASE_URL = process.env.NOTE_FE_BASE_URL;
export const NOTE_FE_SOURCE_DIR = process.env.NOTE_FE_SOURCE_DIR;
export const NOTE_PUBLISH_DIR = process.env.NOTE_PUBLISH_DIR;
export const NOTE_IMAGES_PUBLISH_DIR = process.env.NOTE_IMAGES_PUBLISH_DIR;
export const SINGLE_NOTE_PUBLISH_DIR = process.env.SINGLE_NOTE_PUBLISH_DIR;
export const SINGLE_NOTE_IMAGES_PUBLISH_DIR = process.env.SINGLE_NOTE_IMAGES_PUBLISH_DIR;
export const PUBLISH_SCRIPT = process.env.PUBLISH_SCRIPT;
export const DEPLOY_NOTE_SCRIPT = process.env.DEPLOY_NOTE_SCRIPT;
export const UNPULISH_NOTE_SCRIPT = process.env.UNPULISH_NOTE_SCRIPT;
export const DEPLOY_FE_SCRIPT = process.env.DEPLOY_FE_SCRIPT;
export const DEPLOY_NOTES_SCRIPT = process.env.DEPLOY_NOTES_SCRIPT;

export const FILE_TEMP_DIR =
  process.env.FILE_TEMP_DIR && process.env.FILE_TEMP_DIR.startsWith('/')
    ? process.env.FILE_TEMP_DIR
    : join(__dirname, process.env.FILE_TEMP_DIR);

export const NOTE_DATA_DRAFT_DIR = join(FILE_TEMP_DIR, 'note-draft');

export const FILE_TEMP_URL_PREFIX = process.env.FILE_TEMP_URL_PREFIX;

export const NOTE_URL_BASE = StringUtils.joinUrl(
  process.env.BASE_URL,
  PATH_NOTES,
  PATH_NOTES_FILE
);
