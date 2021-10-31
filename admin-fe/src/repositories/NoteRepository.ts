import PageDto from '../dtos/PageDto';
import NotePreviewDto from '../dtos/NotePreviewDto';
import api from './Api'
import NoteCreateDto from '../dtos/NoteCreateDto';

export default {
  getList(): Promise<PageDto<NotePreviewDto>> {
    return api.get('notes');
  },
  create(dto: NoteCreateDto) {
    return api.post('notes', dto);
  }
}
