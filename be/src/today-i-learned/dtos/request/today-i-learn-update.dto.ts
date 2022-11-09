import { IsNotEmpty } from 'class-validator';

export default class TodayILearnedUpdateDto {
  @IsNotEmpty()
  title: string;
  @IsNotEmpty()
  permalink: string;
  @IsNotEmpty()
  content: string;
  images?: string[];
  tags: string[];
  category: number;
}
