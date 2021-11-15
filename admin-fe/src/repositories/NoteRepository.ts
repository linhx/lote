import PageDto from '../dtos/PageDto';
import NotePreviewDto from '../dtos/NotePreviewDto';
import api from './Api'
import NoteCreateDto from '../dtos/NoteCreateDto';
import ReqNoteFilterDto from '../dtos/ReqNoteFilterDto';
import NoteDto from '../dtos/NoteDto';
import NoteUpdateDto from '../dtos/NoteUpdateDto';

export default {
  getList(filter: ReqNoteFilterDto): Promise<PageDto<NotePreviewDto>> {
    return api.get('notes/all', { params: filter });
  },
  create(dto: NoteCreateDto) {
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
  softDelete(id: string) {
    return api.delete('notes/' + id);
  },
  delete(id: string) {
    return api.delete('notes/h/' + id);
  },
  getContentPreview(id: string): Promise<string> {
    return api.get(`notes/${id}/preview`);
  }
}
