import { Injectable } from '@nestjs/common';
import { Note, NoteDocument } from './entities/Note';
import NoteCreateDto from './dtos/request/NoteCreateDto';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import PageDto from '../dtos/response/PageDto';
import NoteItemListDto from './dtos/response/NoteItemListDto';
import NoteFilterListDto from './dtos/request/NoteFilterListDto';
import * as fs from 'fs';
import * as path from 'path';
import { CSession, Db } from '../common/db';
import { NOTE_DATA_FOLDER } from 'src/constants';
import BusinessError from 'src/exceptions/BusinessError';

@Injectable()
export class NoteService {
  constructor(
    @InjectModel(Note.name) private noteModel: Model<NoteDocument>,
    private db: Db,
  ) {}

  async create(session: CSession, dto: NoteCreateDto) {
    const { content, ...rest } = dto;
    return this.db.withTransaction(session, async (_session) => {
      const existsByPermalink = await this.existsByPermalink(
        _session,
        rest.permalink,
      );
      if (existsByPermalink) {
        throw new BusinessError('error.note.duplicate-permalink');
      }
      const newNote = new this.noteModel(rest);
      const note = await newNote.save({ session: _session });

      // create folder
      const folder = path.join(NOTE_DATA_FOLDER, rest.permalink);
      fs.mkdirSync(path.join(NOTE_DATA_FOLDER, rest.permalink), {
        recursive: true,
      });
      const file = path.join(folder, 'index.json');
      fs.writeFileSync(file, content);
      return note;
    });
  }

  async findById(session: CSession, id: string) {
    return this.db.withTransaction(session, (ss) => {
      return this.noteModel.findById(id).session(ss).exec();
    });
  }

  async findByPermalink(session: CSession, permalink: string) {
    return this.db.withTransaction(session, (ss) => {
      return this.noteModel.findOne({
        permalink
      }).session(ss).exec();
    });
  }

  existsByPermalink(session: CSession, permalink: string): Promise<Boolean> {
    return this.db.withTransaction(session, (ss) => {
      return this.noteModel.count({
        permalink,
      }).session(ss).exec();
    });
  }

  async getPublishedList(session: CSession, dto: NoteFilterListDto): Promise<PageDto<NoteItemListDto>> {
    const condition = {
      isPublished: true,
      isDeleted: false
    }

    return this.db.withTransaction(session, async (ss) => {
      var items = await this.noteModel
      .find(condition)
      .session(ss)
      .sort({ createdAt: 1 })
      .skip(dto.getSkip())
      .limit(dto.limit).exec().then(results => results.map(rs => NoteItemListDto.fromEntity(rs)));
  
      const count = await this.noteModel.count(condition).exec();
  
      return PageDto.create(items, dto.page, dto.limit, count);
    });
  }

  async findAll(session: CSession, dto: NoteFilterListDto): Promise<PageDto<NoteItemListDto>> {
    return this.db.withTransaction(session, async (ss) => {
      var items = await this.noteModel
      .find()
      .session(ss)
      .sort({ createdAt: 1 })
      .skip(dto.getSkip())
      .limit(dto.limit).exec().then(results => results.map(rs => NoteItemListDto.fromEntity(rs)));
  
      const count = await this.noteModel.count().exec();
  
      return PageDto.create(items, dto.page, dto.limit, count);
    });
  }
}
