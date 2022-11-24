import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UploadedFile,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
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
import EmojiFilterListDto from './dtos/request/emoji-filter-list.dto';

const EMOJIS_PATH_TEMP = path.join(FILE_DIR, PATH_EMOJIS, 'temp');

@Controller(PATH_EMOJIS)
export class EmojiController {
  constructor(private readonly emojiService: EmojiService) {
    FileUtils.mkdirSyncIfNotExist(EMOJIS_PATH_TEMP, { recursive: true });
  }
  @Post()
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: (req, file, cb) => {
          const dir = path.join(FILE_DIR, PATH_EMOJIS, FileUtils.createValidPath(req.body.key));
          FileUtils.mkdirSyncIfNotExist(dir, { recursive: true });
          cb(null, dir);
        },
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
  async getAllPaging(@Query() dto: EmojiFilterListDto) {
    const { items, total } = await this.emojiService.findAllPaging(new EmojiFilterListDto(dto));
    return PageDto.create(
      items.map((emoji) => EmojiDto.fromEntity(emoji)),
      dto.page,
      dto.limit,
      total,
    ); // TODO paging if needed
  }

  @Get('all')
  async getAll() {
    const emojis = await this.emojiService.findAll();
    return {
      items: emojis.map((emoji) => EmojiDto.fromEntity(emoji))
    }
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
        destination: (req, file, cb) => {
          const dir = path.join(FILE_DIR, PATH_EMOJIS, FileUtils.createValidPath(req.body.key));
          FileUtils.mkdirSyncIfNotExist(dir, { recursive: true });
          cb(null, dir);
        },
        filename: (req, file, cb) => {
          cb(null, FileUtils.randomFileName(file.originalname));
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

  @Post('import')
  @UseInterceptors(FilesInterceptor('files', 100, {
    storage: diskStorage({
      destination: EMOJIS_PATH_TEMP,
      filename: (req, file, cb) => {
        cb(null, FileUtils.randomFileName(file.originalname));
      },
    }),
  }))
  async import(
    @UploadedFiles() files: Array<Express.Multer.File>,
    @Body() dto: { emojis: string },
  ) {
    return this.emojiService.import(null, JSON.parse(dto.emojis), files);
  }
}
