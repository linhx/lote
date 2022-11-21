import EmojiCreateDto from '../dtos/EmojiCreateDto';
import EmojiUpdateDto from '../dtos/EmojiUpdateDto';
import EmojiDto from '../dtos/EmojiDto';
import PageDto from '../dtos/PageDto';
import EmojiItemListDto from '../dtos/EmojiItemListDto';
import api from './Api';
import ReqEmojiFilterDto from '../dtos/ReqEmojiFilterDto';

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
    formData.append('category', dto.category);
    formData.append('key', dto.key);
    formData.append('name', dto.name);
    return api.post(PATH, formData);
  },

  getList(filter: ReqEmojiFilterDto): Promise<PageDto<EmojiItemListDto>> {
    return api.get(PATH, { params: filter });
  },

  getAll(): Promise<PageDto<EmojiItemListDto>> {
    return api.get(`${PATH}/all`);
  },

  getById(id: string): Promise<EmojiDto> {
    return api.get(`${PATH}/${id}`);
  },

  async update(dto: EmojiUpdateDto) {
    const formData = new FormData();
    if (dto.file) {
      formData.append('file', dto.file);
    }
    formData.append('id', dto.id);
    formData.append('group', dto.group);
    formData.append('category', dto.category);
    formData.append('key', dto.key);
    formData.append('name', dto.name);
    return api.put(PATH, formData);
  },

  deleteById(id: string) {
    return api.delete(`${PATH}/${id}`);
  },

  async import(emojis: Array<EmojiCreateDto>) {
    const emojiData = []
    const formData = new FormData();
    for (const emoji of emojis) {
      if(!emoji.file) {
        continue;
      }
      formData.append('files', emoji.file);
      emojiData.push({
        group: emoji.group,
        groupName: emoji.group,
        category: emoji.category,
        key: emoji.key,
        name: emoji.name,
      });
    }
    formData.append('emojis', JSON.stringify(emojiData));
    return api.post(`${PATH}/import`, formData);
  }
};
