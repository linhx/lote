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
import { SkipThrottle } from '@nestjs/throttler';
import { Public } from 'src/auth/sso.strategy';
import NoteCreateDto from 'src/note/dtos/request/NoteCreateDto';
import NoteFilterListDto from './dtos/request/NoteFilterListDto';
import NoteUpdateDto from './dtos/request/NoteUpdateDto';
import PublicNoteDto from './dtos/response/PublicNoteDto';
import { NoteService } from './note.service';
import { PATH_NOTES } from 'src/constants';
import { Cache } from 'cache-manager';
import NoteDto from './dtos/response/NoteDto';

@SkipThrottle()
@Controller(PATH_NOTES)
export class NoteController {
  constructor(
    private readonly noteService: NoteService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  @Public()
  @Get()
  getPublishedList(@Query() dto: NoteFilterListDto) {
    return this.noteService.getPublishedList(null, new NoteFilterListDto(dto));
  }

  @Get('all')
  getAll(@Query() dto: NoteFilterListDto) {
    return this.noteService.findAll(null, new NoteFilterListDto(dto));
  }

  @Public()
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
    return NoteDto.fromEntity(note);
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
