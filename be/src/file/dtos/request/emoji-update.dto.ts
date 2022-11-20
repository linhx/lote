import { IsNotEmpty } from 'class-validator';

export default class EmojiUpdateDto {
  @IsNotEmpty()
  id: string;
  @IsNotEmpty()
  group: string;
  @IsNotEmpty()
  key: string;
  name: string;
}
