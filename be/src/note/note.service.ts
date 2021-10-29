import { Injectable } from '@nestjs/common';
import { Note, NoteDocument } from './entities/Note';
import NoteCreateDto from './dtos/request/NoteCreateDto';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import PageDto from '../dtos/response/PageDto';
import NoteItemListDto from './dtos/response/NoteItemListDto';
import NoteFilterListDto from './dtos/request/NoteFilterListDto';

@Injectable()
export class NoteService {
  constructor(@InjectModel(Note.name) private noteModel: Model<NoteDocument>) {}

  async create(dto: NoteCreateDto) {
    const newNote = new this.noteModel(dto);
    return newNote.save();
  }

  async getPublishedList(dto: NoteFilterListDto): Promise<PageDto<NoteItemListDto>> {
    const condition = {
      isPublished: true,
      isDeleted: false
    }

    var items = await this.noteModel.find(condition)
    .sort({ createdAt: 1 })
    .skip(dto.getSkip())
    .limit(dto.limit).exec().then(results => results.map(rs => NoteItemListDto.fromEntity(rs)));

    const count = await this.noteModel.count(condition).exec();

    return PageDto.create(items, dto.page, dto.limit, count);
  }
}
