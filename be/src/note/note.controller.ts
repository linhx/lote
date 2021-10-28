import { Body, Controller, Get, Post } from '@nestjs/common';
import NoteCreateDto from 'src/note/dtos/request/NoteCreateDto';
import { NoteService } from './note.service';

@Controller('notes')
export class NoteController {
  constructor(private readonly appService: NoteService) {}

  @Get()
  getHello(): string {
    return '';
  }

  @Post()
  async create(@Body() dto: NoteCreateDto) {
    return this.appService.create(dto);
  }
}
