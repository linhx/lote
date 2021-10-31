import { IsNotEmpty } from 'class-validator';

export default class NoteCreateDto {
  @IsNotEmpty()
  permalink: string;
  @IsNotEmpty()
  title: string;
  @IsNotEmpty()
  overview: string;
  @IsNotEmpty()
  content: string;
  tags: string[];
  category: number;
}
