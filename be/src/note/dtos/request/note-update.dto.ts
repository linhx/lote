import { IsNotEmpty } from 'class-validator';

export default class NoteUpdateDto {
  @IsNotEmpty()
  title: string;
  @IsNotEmpty()
  permalink: string;
  banner: string;
  @IsNotEmpty()
  overview: string;
  @IsNotEmpty()
  content: string;
  images?: string[];
  tags: string[];
  category: number;
}
