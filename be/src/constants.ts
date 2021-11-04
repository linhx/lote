import { join } from 'path';
import {URL} from "url";
import * as StringUtils from './utilites/StringUtils';

export const STATIC_FOLDER = process.env.STATIC_FOLDER.startsWith('/')
  ? process.env.STATIC_FOLDER
  : join(__dirname, process.env.STATIC_FOLDER);

const NOTE_FOLDER = 'note';
export const NOTE_DATA_FOLDER = join(STATIC_FOLDER, NOTE_FOLDER);
export const NOTE_DATA_DRAFT_FOLDER = join(STATIC_FOLDER, 'note-draft');

export const FILE_TEMP_FOLDER = process.env.FILE_TEMP_FOLDER && process.env.FILE_TEMP_FOLDER.startsWith('/')
  ? process.env.FILE_TEMP_FOLDER
  : join(__dirname, process.env.FILE_TEMP_FOLDER);

export const FILE_TEMP_URL_PREFIX = process.env.FILE_TEMP_URL_PREFIX;


export const STATIC_URL_PREFIX = '/static';
export const NOTE_URL_BASE = StringUtils.joinUrl(process.env.BASE_URL, STATIC_URL_PREFIX, NOTE_FOLDER);