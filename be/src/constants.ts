import { join } from 'path';
import * as StringUtils from './utilites/StringUtils';

export const PATH_NOTES = 'notes';
export const PATH_NOTES_FILE = 'f';

export const NOTE_FE_BASE_URL = process.env.NOTE_FE_BASE_URL;
export const NOTE_FE_SOURCE_FOLDER = process.env.NOTE_FE_SOURCE_FOLDER;
export const NOTE_FE_BUILD_FOLDER = process.env.NOTE_FE_BUILD_FOLDER;
export const NOTE_FE_DEPLOY_FOLDER = process.env.NOTE_FE_DEPLOY_FOLDER;
export const NOTE_PUBLISH_FOLDER = process.env.NOTE_PUBLISH_FOLDER;
export const NOTE_IMAGES_PUBLISH_FOLDER = process.env.NOTE_IMAGES_PUBLISH_FOLDER;
export const PUBLISH_SCRIPT = process.env.PUBLISH_SCRIPT;
export const DEPLOY_NOTE_SCRIPT = process.env.DEPLOY_NOTE_SCRIPT;
export const UNPULISH_NOTE_SCRIPT = process.env.UNPULISH_NOTE_SCRIPT;

export const FILE_TEMP_FOLDER =
  process.env.FILE_TEMP_FOLDER && process.env.FILE_TEMP_FOLDER.startsWith('/')
    ? process.env.FILE_TEMP_FOLDER
    : join(__dirname, process.env.FILE_TEMP_FOLDER);

export const NOTE_DATA_DRAFT_FOLDER = join(FILE_TEMP_FOLDER, 'note-draft');

export const FILE_TEMP_URL_PREFIX = process.env.FILE_TEMP_URL_PREFIX;

export const NOTE_URL_BASE = StringUtils.joinUrl(
  process.env.BASE_URL,
  PATH_NOTES,
  PATH_NOTES_FILE
);
