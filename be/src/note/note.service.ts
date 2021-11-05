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
import {
  NOTE_DATA_DRAFT_FOLDER,
  NOTE_DATA_FOLDER,
  NOTE_URL_BASE,
  STATIC_URL_PREFIX,
} from 'src/constants';
import BusinessError from 'src/exceptions/BusinessError';
import { FileService } from '../file/file.service';
import HtmlUtils from './utilities/HtmlUtils';
import * as StringUtils from '../utilites/StringUtils';
import * as FileUtils from '../utilites/FileUtils';

@Injectable()
export class NoteService {
  constructor(
    @InjectModel(Note.name) private noteModel: Model<NoteDocument>,
    private readonly db: Db,
    private readonly fileService: FileService,
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

      const images = [];
      if (rest.banner) {
        images.push(rest.banner);
      }
      for (let op of content.ops) {
        if (op.insert?.imagec) {
          images.push(op.insert?.imagec.id);
        }
      }

      // make images not temporary files
      await this.fileService.permanentFile(_session, images);

      const newNote = new this.noteModel({
        ...rest,
        images,
      });
      const note = await newNote.save({ session: _session });

      // create folder
      const folder = path.join(NOTE_DATA_DRAFT_FOLDER, rest.permalink);
      fs.mkdirSync(folder, {
        recursive: true,
      });
      const file = path.join(folder, 'index.json');
      fs.writeFileSync(file, JSON.stringify(content));

      note.content = file;
      await note.save();
      return note;
    });
  }

  async publishById(session: CSession, id: string) {
    return this.db.withTransaction(session, async (_session) => {
      const note = await this.findById(_session, id);
      return this.publish(_session, note);
    });
  }

  async publish(session: CSession, note: NoteDocument) {
    return this.db.withTransaction(session, async (_session) => {
      const folder = path.join(NOTE_DATA_FOLDER, note.permalink);

      fs.rmdirSync(folder, { recursive: true });
      fs.mkdirSync(folder, {
        recursive: true,
      });

      const file = path.join(folder, 'index.html');
      const contentJson = fs.readFileSync(note.content, { encoding: 'utf8' });
      const noteUrl = StringUtils.joinUrl(NOTE_URL_BASE, note.permalink);
      const contentHtml = HtmlUtils.deltaToHtml(
        JSON.parse(contentJson),
        noteUrl,
      );
      fs.writeFileSync(file, contentHtml);

      const files = await this.fileService.findByIds(_session, note.images);

      const folderImg = path.join(folder, 'img');
      fs.mkdirSync(folderImg, {
        recursive: true,
      });

      for (let file of files) {
        fs.copyFileSync(
          file.path,
          path.join(folderImg, `${file._id}.${FileUtils.getExt(file.name)}`),
        );
      }

      note.isPublished = true;
      await note.save();
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
      return this.noteModel
        .findOne({
          permalink,
        })
        .session(ss)
        .exec();
    });
  }

  existsByPermalink(session: CSession, permalink: string): Promise<Boolean> {
    return this.db.withTransaction(session, (ss) => {
      return this.noteModel
        .count({
          permalink,
        })
        .session(ss)
        .exec();
    });
  }

  async getPublishedList(
    session: CSession,
    dto: NoteFilterListDto,
  ): Promise<PageDto<NoteItemListDto>> {
    const condition = {
      isPublished: true,
      isDeleted: false,
    };

    return this.db.withTransaction(session, async (ss) => {
      const items = await this.noteModel
        .find(condition)
        .session(ss)
        .sort({ createdAt: 1 })
        .skip(dto.getSkip())
        .limit(dto.limit)
        .exec()
        .then((results) => results.map((rs) => NoteItemListDto.fromEntity(rs)));

      const count = await this.noteModel.count(condition).exec();

      return PageDto.create(items, dto.page, dto.limit, count);
    });
  }

  async findAll(
    session: CSession,
    dto: NoteFilterListDto,
  ): Promise<PageDto<NoteItemListDto>> {
    return this.db.withTransaction(session, async (ss) => {
      const items = await this.noteModel
        .find()
        .session(ss)
        .sort({ createdAt: 1 })
        .skip(dto.getSkip())
        .limit(dto.limit)
        .exec()
        .then((results) => results.map((rs) => NoteItemListDto.fromEntity(rs)));

      const count = await this.noteModel.count().exec();

      return PageDto.create(items, dto.page, dto.limit, count);
    });
  }
}
