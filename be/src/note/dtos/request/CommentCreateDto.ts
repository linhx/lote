import { Transform, TransformFnParams } from 'class-transformer';
import { IsNotEmpty, MaxLength } from 'class-validator';

export default class CommentCreateDto {
  parentId: string;

  @Transform(({ value }: TransformFnParams) => (value ? value.trim() : ''))
  @MaxLength(20)
  author: string;

  @Transform(({ value }: TransformFnParams) => (value ? value.trim() : ''))
  @IsNotEmpty()
  @MaxLength(500)
  content: string;
}
