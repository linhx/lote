import PageDto from '../dtos/PageDto';
import NotePreviewDto from '../dtos/NotePreviewDto';
import api from './Api'
import NoteCreateDto from '../dtos/NoteCreateDto';
import ReqNoteFilterDto from '../dtos/ReqNoteFilterDto';
import NoteUpdateDto from '../dtos/NoteUpdateDto';

export default {
  getList(filter: ReqNoteFilterDto): Promise<PageDto<NotePreviewDto>> {
    return api.get('notes/all', { params: filter });
  },
  create(dto: NoteCreateDto) {
    return api.post('notes', dto);
  },
  findById(id: string): Promise<NoteUpdateDto> {
    return api.get('notes/' + id);
  },
  publish(id: string) {
    return api.post('notes/publish/' + id);
  }
}
