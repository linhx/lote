import { Controller, Get } from '@nestjs/common';
import { NoteService } from '../services/note.service';

@Controller('notes')
export class NoteController {
  constructor(private readonly appService: NoteService) {}

  @Get()
  getHello(): string {
    return '';
  }
}
