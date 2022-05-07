import api from './Api'
import CommentsDto from '../dtos/CommentsDto';
import CommentDto from '../dtos/CommentDto';

export default {
  getList(noteId: string): Promise<CommentsDto> {
    return api.get(`comments/n/${noteId}`);
  },

  post(noteId: string, dto: any): Promise<CommentDto> {
    return api.post(`comments/n/${noteId}`, dto);
  },

  active(noteId: string, commentId: string) {
    return api.put(`comments/n/${noteId}/${commentId}/active`);
  },

  delete(noteId: string, commentId: string) {
    return api.delete(`comments/n/${noteId}/${commentId}`);
  }
}
