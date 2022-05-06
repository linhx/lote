import { IsNotEmpty, MaxLength } from 'class-validator';

export default class CommentCreateDto {
  parentId: string;

  @IsNotEmpty()
  @MaxLength(20)
  author: string;

  @IsNotEmpty()
  @MaxLength(500)
  content: string;
}
