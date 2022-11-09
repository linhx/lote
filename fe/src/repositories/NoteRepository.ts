import PageDto from '../dtos/PageDto';
import NotePreviewDto from '../dtos/NotePreviewDto';
import api from './Api'
import ReqNoteFilterDto from '../dtos/ReqNoteFilterDto';
import NoteDto from '../dtos/NoteDto';
import axios from 'axios';

export default {
  getList(filter: ReqNoteFilterDto): Promise<PageDto<NotePreviewDto>> {
    return api.get('notes', {
      params: filter
    });
  },

  getContentHTMLByPermalink(permalink: string): Promise<string> {
    return axios.get(`${import.meta.env.VITE_APP_NOTES_HTML_PATH}/${permalink}`).then(res => res.data as string);
  }
}
