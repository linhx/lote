import { EmojiDocument } from '../../entities/emoji.entity';

export default class EmojiDto {
  id: string;
  group: string;
  category: string;
  key: string;
  name: string;
  url: string;

  static fromEntity(emoji: EmojiDocument) {
    const dto = new EmojiDto();
    dto.id = emoji.id.toString();
    dto.group = emoji.group;
    dto.category = emoji.category;
    dto.key = emoji.key;
    dto.name = emoji.name;
    dto.url = emoji.url;
    return dto;
  }
}
