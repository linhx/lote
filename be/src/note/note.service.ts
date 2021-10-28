import { Injectable } from '@nestjs/common';
import { Note, NoteDocument } from './entities/Note';
import NoteCreateDto from './dtos/request/NoteCreateDto';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class NoteService {
  constructor(@InjectModel(Note.name) private noteModel: Model<NoteDocument>) {}

  async create(dto: NoteCreateDto) {
    const newNote = new this.noteModel(dto);
    return newNote.save();
  }
}
