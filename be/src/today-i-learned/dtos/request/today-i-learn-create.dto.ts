import { IsNotEmpty } from 'class-validator';

export default class TodayILearnedCreateDto {
  @IsNotEmpty()
  permalink: string;
  @IsNotEmpty()
  title: string;
  @IsNotEmpty()
  content: string;
  images?: string[];
  tags: string[];
  category: number;
}
