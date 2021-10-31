import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import NoteCreateDto from 'src/note/dtos/request/NoteCreateDto';
import NoteFilterListDto from './dtos/request/NoteFilterListDto';
import { NoteService } from './note.service';

@Controller('notes')
export class NoteController {
  constructor(private readonly noteService: NoteService) {}

  @Get()
  getList(@Query() dto: NoteFilterListDto) {
    return this.noteService.getPublishedList(null, new NoteFilterListDto(dto));
  }

  @Get('l/:permalink')
  getByPermalink(@Param('permalink') permalink: string) {
    return this.noteService.findPermalink(null, permalink);
  }

  @Post()
  async create(@Body() dto: NoteCreateDto) {
    return this.noteService.create(null, dto);
  }
}
