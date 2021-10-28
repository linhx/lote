import PageDto from '../dtos/PageDto';
import NotePreviewDto from '../dtos/NotePreviewDto';
import api from './Api'

export default {
  getList(): Promise<PageDto<NotePreviewDto>> {
    return api.get('notes');
  }
}
