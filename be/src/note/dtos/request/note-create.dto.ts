import { IsNotEmpty } from 'class-validator';

export default class NoteCreateDto {
  @IsNotEmpty()
  permalink: string;
  @IsNotEmpty()
  title: string;
  banner: string;
  @IsNotEmpty()
  overview: string;
  @IsNotEmpty()
  content: string;
  images?: string[];
  tags: string[];
  category: number;
}
