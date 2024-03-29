import { IsNotEmpty } from 'class-validator';

export default class EmojiCreateDto {
  @IsNotEmpty()
  group: string;
  @IsNotEmpty()
  groupName: string;
  category: string;
  name: string;
  @IsNotEmpty()
  key: string;
}
