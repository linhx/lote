import PageDto from '../dtos/PageDto';
import NoteItemListDto from '../dtos/NoteItemListDto';
import api from './Api'
import NoteCreateDto from '../dtos/NoteCreateDto';
import ReqNoteFilterDto from '../dtos/ReqTodayILearnedFilterDto';
import NoteDto from '../dtos/NoteDto';
import NoteUpdateDto from '../dtos/NoteUpdateDto';

export default {
  getList(filter: ReqNoteFilterDto): Promise<PageDto<NoteItemListDto>> {
    return api.get('notes/all', { params: filter });
  },
  create(dto: NoteCreateDto): Promise<NoteDto> {
    return api.post('notes', dto);
  },
  findById(id: string): Promise<NoteDto> {
    return api.get('notes/' + id);
  },
  update(id: string, dto: NoteUpdateDto) {
    return api.post('notes/' + id, dto);
  },
  publish(id: string) {
    return api.post('notes/publish/' + id);
  },
  unpublish(id: string) {
    return api.post('notes/unpublish/' + id);
  },
  softDelete(id: string) {
    return api.delete('notes/' + id);
  },
  delete(id: string) {
    return api.delete('notes/h/' + id);
  },
  getContentPreview(id: string): Promise<{ content: string; tableOfContents: string }> {
    return api.get(`notes/${id}/preview`);
  },
  republishAllNotes() {
    return api.post(`notes/republish-notes`);
  },
}
