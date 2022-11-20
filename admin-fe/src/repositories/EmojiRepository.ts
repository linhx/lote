import EmojiCreateDto from '../dtos/EmojiCreateDto';
import EmojiUpdateDto from '../dtos/EmojiUpdateDto';
import EmojiDto from '../dtos/EmojiDto';
import PageDto from '../dtos/PageDto';
import EmojiItemListDto from '../dtos/EmojiItemListDto';
import api from './Api';

export const PATH = '/emojis';

export default {
  async create(dto: EmojiCreateDto) {
    const formData = new FormData();
    if (!dto.file) {
      throw new Error('Missing emoji file');
    }
    formData.append('file', dto.file);
    formData.append('group', dto.group);
    formData.append('groupName', dto.group);
    formData.append('key', dto.key);
    formData.append('name', dto.name);
    return api.post(PATH, formData);
  },

  getAll(): Promise<PageDto<EmojiItemListDto>> {
    return api.get(PATH);
  },

  getById(id: string): Promise<EmojiDto> {
    return api.get(`${PATH}/${id}`);
  },

  update(dto: EmojiUpdateDto) {
    const formData = new FormData();
    if (dto.file) {
      formData.append('file', dto.file);
    }
    formData.append('id', dto.id);
    formData.append('group', dto.group);
    formData.append('key', dto.key);
    formData.append('name', dto.name);
    return api.put(PATH, formData);
  },

  deleteById(id: string) {
    return api.delete(`${PATH}/${id}`);
  },
};
