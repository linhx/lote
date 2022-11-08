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

  getByPermalink(permalink: string): Promise<NoteDto> {
    return api.get('notes/l/' + permalink);
  },

  getContentHTMLByPermalink(permalink: string): Promise<string> {
    return axios.get(`/notes/${permalink}`).then(res => res.data as string);
  }
}
