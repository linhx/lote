import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { FILE_DIR, PATH_EMOJIS } from '../constants';
import * as FileUtils from '../utilities/FileUtils';
import FileDto from './dtos/response/file.dto';
import * as path from 'path';
import EmojiCreateDto from './dtos/request/emoji-create.dto';
import { EmojiService } from './emoji.service';
import EmojiDto from './dtos/response/emoji.dto';
import PageDto from '../dtos/response/page.dto';
import EmojiUpdateDto from './dtos/request/emoji-update.dto';
import { Public } from 'src/auth/sso.strategy';

@Controller(PATH_EMOJIS)
export class EmojiController {
  constructor(private readonly emojiService: EmojiService) {}
  @Post()
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: path.join(FILE_DIR, PATH_EMOJIS),
        filename: (req, file, cb) => {
          cb(null, FileUtils.randomFileName(file.originalname));
        },
      }),
    }),
  )
  async uploadEmoji(
    @UploadedFile() file: Express.Multer.File,
    @Body() dto: EmojiCreateDto,
  ) {
    const cFile = await this.emojiService.save(null, dto, file);
    return FileDto.fromEntity(cFile);
  }

  @Get()
  async getAll() {
    const emojis = await this.emojiService.findAll();
    return PageDto.create(
      emojis.map((emoji) => EmojiDto.fromEntity(emoji)),
      1,
      emojis.length,
      emojis.length,
    ); // TODO paging if needed
  }

  @Get('/:id')
  getById(@Param('id') id: string) {
    return this.emojiService
      .findById(null, id)
      .then((emoji) => EmojiDto.fromEntity(emoji));
  }

  @Put()
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: path.join(FILE_DIR, PATH_EMOJIS),
        filename: (req, file, cb) => {
          cb(null, `${req.body.key}.${FileUtils.getExt(file.originalname)}`);
        },
      }),
    }),
  )
  async updateEmoji(
    @UploadedFile() file: Express.Multer.File,
    @Body() dto: EmojiUpdateDto,
  ) {
    const cFile = await this.emojiService.update(null, dto, file);
    return FileDto.fromEntity(cFile);
  }

  @Delete('/:id')
  deleteById(@Param('id') id: string) {
    return this.emojiService.deleteById(null, id);
  }
}
