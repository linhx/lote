import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { Public } from 'src/auth/sso.strategy';
import { PATH_COMMENTS } from 'src/constants';
import { CommentService } from './comment.service';
import CommentCreateDto from './dtos/CommentCreateDto';
import CommentDto from './dtos/CommentDto';
import CommentsDto from './dtos/CommentsDto';

@Controller(PATH_COMMENTS)
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Throttle(1, 7)
  @Public()
  @Post('/:permalink')
  async create(
    @Param('permalink') permalink: string,
    @Body() dto: CommentCreateDto,
  ) {
    await this.commentService.create(null, permalink, dto);
    return {};
  }

  @Public()
  @Get('/:permalink')
  async getAllByPermalink(@Param('permalink') permalink: string) {
    const comments = await this.commentService.getAllByPermalink(
      null,
      permalink,
    );
    const dto = new CommentsDto();
    dto.items = comments.map((comment) => CommentDto.fromEntity(comment));
    return dto;
  }
}
