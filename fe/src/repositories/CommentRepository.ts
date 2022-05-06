import CommentsDto from '../dtos/CommentsDto';
import api from './Api'

export default {
  getList(permalink: string): Promise<CommentsDto> {
    return api.get(`comments/${permalink}`);
  },

  post(permalink: string, dto: any) {
    return api.post(`comments/${permalink}`, dto);
  }
}
