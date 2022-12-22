import CommentsDto from '../dtos/CommentsDto';
import api from './PublicApi';

export default {
  getList(permalink: string): Promise<CommentsDto> {
    return api.get(`comments/${permalink}`);
  },

  post(permalink: string, dto: any) {
    return api.post(`comments/${permalink}`, dto);
  },
};
