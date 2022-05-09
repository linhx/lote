import { Transform, TransformFnParams } from 'class-transformer';
import { IsNotEmpty, IsOptional, MaxLength } from 'class-validator';

export default class CommentCreateDto {
  parentId: string;

  @IsOptional()
  @Transform(({ value }: TransformFnParams) => (value ? value.trim() : ''))
  @MaxLength(30)
  authorName: string;

  @Transform(({ value }: TransformFnParams) => (value ? value.trim() : ''))
  @IsNotEmpty()
  @MaxLength(500)
  content: string;

  author: {
    name: string;
    uuid: string;
    role: string;
  };
}
