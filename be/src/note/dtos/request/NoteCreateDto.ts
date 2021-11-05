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
  content: any;
  tags: string[];
  category: number;
}
