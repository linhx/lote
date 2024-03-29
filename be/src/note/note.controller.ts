import {
  Body,
  CACHE_MANAGER,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { SkipThrottle, Throttle } from '@nestjs/throttler';
import { Public } from '../auth/sso.strategy';
import NoteCreateDto from './dtos/request/note-create.dto';
import NoteFilterListDto from './dtos/request/note-filter-list.dto';
import NoteUpdateDto from './dtos/request/note-update.dto';
import PublicNoteDto from './dtos/response/public-note.dto';
import { NoteService } from './note.service';
import { PATH_NOTES } from '../constants';
import { Cache } from 'cache-manager';
import NoteDto from './dtos/response/note.dto';
import { FileService } from '../file/file.service';

@SkipThrottle()
@Controller(PATH_NOTES)
export class NoteController {
  constructor(
    private readonly noteService: NoteService,
    private readonly fileService: FileService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  @Public()
  @Throttle(5, 5)
  @Get()
  getPublishedList(@Query() dto: NoteFilterListDto) {
    return this.noteService.getPublishedList(null, new NoteFilterListDto(dto));
  }

  @Get('all')
  getAll(@Query() dto: NoteFilterListDto) {
    return this.noteService.findAll(null, new NoteFilterListDto(dto));
  }

  @Public()
  @Throttle(5, 5)
  @Get('l/:permalink')
  async getPublisedByPermalink(@Param('permalink') permalink: string) {
    const entity = await this.noteService.findPublishedByPermalink(
      null,
      permalink,
    );
    return PublicNoteDto.fromEntity(entity);
  }

  @Post()
  async create(@Body() dto: NoteCreateDto) {
    const newNote = await this.noteService.create(null, dto);
    return NoteDto.fromEntityWithoutContent(newNote);
  }

  @Post('republish-notes')
  async republishAllNotes() {
    return this.noteService.republishAllNotes(null);
  }

  @Get('/:id')
  async getById(@Param('id') id: string) {
    const note = await this.noteService.findById(null, id);
    let bannerUrl;
    if (note.banner) {
      const banner = await this.fileService.findById(null, note.banner);
      bannerUrl = banner?.url;
    }
    return NoteDto.fromEntity(note, bannerUrl);
  }

  @Post('/:id')
  async update(@Param('id') id: string, @Body() dto: NoteUpdateDto) {
    return this.noteService.update(null, id, dto);
  }

  @Post('publish/:id')
  async publish(@Param('id') id: string) {
    return this.noteService.publishById(null, id);
  }

  @Post('unpublish/:id')
  async unpublish(@Param('id') id: string) {
    return this.noteService.unpublishById(null, id);
  }

  @Delete('h/:id')
  async delete(@Param('id') id: string) {
    await this.noteService.deleteById(null, id);
  }

  @Delete('/:id')
  async softDelete(@Param('id') id: string) {
    await this.noteService.softDeleteById(null, id);
  }

  @Get(':id/preview')
  async preview(@Param('id') id: string) {
    return this.noteService.getContentPreview(null, id);
  }
}
