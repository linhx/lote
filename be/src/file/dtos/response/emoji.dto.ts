import { EmojiDocument } from '../../entities/emoji.entity';

export default class EmojiDto {
  id: string;
  group: string;
  key: string;
  name: string;
  url: string;

  static fromEntity(emoji: EmojiDocument) {
    const dto = new EmojiDto();
    dto.id = emoji.id.toString();
    dto.group = emoji.group;
    dto.key = emoji.key;
    dto.name = emoji.name;
    dto.url = new URL(emoji.url, process.env.BASE_URL).href;
    return dto;
  }
}
