import PageDto from '../dtos/PageDto';
import NotePreviewDto from '../dtos/NotePreviewDto';
import api from './Api'
import ReqNoteFilterDto from '../dtos/ReqNoteFilterDto';
import NoteDto from '../dtos/NoteDto';

export default {
  getList(filter: ReqNoteFilterDto): Promise<PageDto<NotePreviewDto>> {
    return api.get('notes', {
      params: filter
    });
  },

  getContentHTMLByPermalink(permalink: string): Promise<string> {
    return api.get(`files/publish/notes/${permalink}.html`);
  },

  getByPermalink(permalink: string): Promise<NoteDto> {
    return api.get(`notes/l/${permalink}`);
  }
}
