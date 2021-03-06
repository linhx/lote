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

  getByPermalink(permalink: string): Promise<NoteDto> {
    return api.get('notes/l/' + permalink);
  },

  getContent(permalink: string): Promise<string> {
    return api.get(`notes/f/${permalink}/index.html`)
  }
}
