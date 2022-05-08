import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Request,
  UseGuards,
} from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { Public } from 'src/auth/sso.strategy';
import { PATH_COMMENTS } from 'src/constants';
import BusinessError from 'src/exceptions/BusinessError';
import { RecaptchaGuard } from 'src/guards/recaptcha.guard';
import { CommentService } from './comment.service';
import CommentCreateDto from './dtos/request/CommentCreateDto';
import CommentDto from './dtos/response/CommentDto';
import CommentsDto from './dtos/response/CommentsDto';
import * as md5 from 'blueimp-md5';
import * as RequestIp from 'request-ip';
import ROLES from '../constants/roles';

const createUserMd5 = (name: string, req: any) => {
  return md5(`${name}-${RequestIp.getClientIp(req)}`);
};

const DEFAULT_AUTHOR_NAME = 'Anonymous';

@Controller(PATH_COMMENTS)
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  private static FORBIDDEN_NAMES = [
    'linhx',
    'admin',
    'administrator',
    'mod',
    'moderator',
  ];

  @Throttle(1, 7)
  @Public()
  @Post('/:permalink')
  @UseGuards(RecaptchaGuard)
  async publicCreate(
    @Request() req,
    @Param('permalink') permalink: string,
    @Body() dto: CommentCreateDto,
  ) {
    if (
      CommentController.FORBIDDEN_NAMES.includes(dto.authorName.toLowerCase())
    ) {
      throw new BusinessError('error.comment.create.forbiddenName');
    }
    if (!dto.authorName) {
      dto.authorName = DEFAULT_AUTHOR_NAME;
    } else if (dto.authorName.length < 2) {
      throw new BusinessError('error.comment.create.nameToShort'); // TODO validation or use 400 status
    }
    dto.author = {
      name: dto.authorName,
      uuid: createUserMd5(dto.authorName, req),
      role: ROLES.GUEST,
    };
    await this.commentService.createByPermalink(null, permalink, dto);
    return {};
  }

  @Public()
  @Get('/:permalink')
  async getAllActiveByPermalink(@Param('permalink') permalink: string) {
    const comments = await this.commentService.getAllActiveByPermalink(
      null,
      permalink,
    );
    const dto = new CommentsDto();
    dto.items = comments.map((comment) => CommentDto.fromEntity(comment));
    return dto;
  }

  @Post('/n/:noteId')
  async create(
    @Request() req,
    @Param('noteId') noteId: string,
    @Body() dto: CommentCreateDto,
  ) {
    dto.authorName = process.env.COMMENT_ADMIN_NAME || req.user.username;
    dto.author = {
      name: dto.authorName,
      uuid: '',
      role: ROLES.ADMIN,
    };
    const comment = await this.commentService.createByNoteId(null, noteId, dto);
    return CommentDto.fromEntity(comment);
  }

  @Public()
  @Get('/n/:noteId')
  async getAllByNoteId(@Param('noteId') noteId: string) {
    const comments = await this.commentService.getAllByNoteId(null, noteId);
    const dto = new CommentsDto();
    dto.items = comments.map((comment) => CommentDto.fromEntity(comment));
    return dto;
  }

  @Put('/n/:noteId/:id/active')
  async active(@Param('noteId') noteId: string, @Param('id') id: string) {
    await this.commentService.active(null, noteId, id);
    return;
  }

  @Delete('/n/:noteId/:id')
  async delete(@Param('noteId') noteId: string, @Param('id') id: string) {
    await this.commentService.delete(null, noteId, id);
    return;
  }
}
