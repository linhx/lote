import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { Public } from 'src/auth/oauth2.strategy';
import NoteCreateDto from 'src/note/dtos/request/NoteCreateDto';
import NoteFilterListDto from './dtos/request/NoteFilterListDto';
import NoteUpdateDto from './dtos/request/NoteUpdateDto';
import PublicNoteDto from './dtos/response/PublicNoteDto';
import { NoteService } from './note.service';

@Controller('notes')
export class NoteController {
  constructor(private readonly noteService: NoteService) {}

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
    const entity = await this.noteService.findPublisedByPermalink(
      null,
      permalink,
    );
    return PublicNoteDto.fromEntity(entity);
  }

  @Post()
  async create(@Body() dto: NoteCreateDto) {
    return this.noteService.create(null, dto);
  }

  @Get('/:id')
  async getById(@Param('id') id: string) {
    return this.noteService.findIncludeContentById(null, id);
  }

  @Post('/:id')
  async update(@Param('id') id: string, @Body() dto: NoteUpdateDto) {
    return this.noteService.update(null, id, dto);
  }

  @Post('publish/:id')
  async publish(@Param('id') id: string) {
    return this.noteService.publishById(null, id);
  }
}
