import { Injectable, Logger } from '@nestjs/common';
import { Note, NoteDocument } from './entities/Note';
import NoteCreateDto from './dtos/request/NoteCreateDto';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import PageDto from '../dtos/response/PageDto';
import NoteItemListDto from './dtos/response/NoteItemListDto';
import PublicNoteItemListDto from './dtos/response/PublicNoteItemListDto';
import NoteFilterListDto from './dtos/request/NoteFilterListDto';
import * as path from 'path';
import { CSession, Db } from '../common/db';
import {
  NOTES_PUBLISHED_DIR,
} from 'src/constants';
import BusinessError from 'src/exceptions/BusinessError';
import { FileService } from '../file/file.service';
import * as NoteContentUtil from '../utilities/content/note-content';
import * as ArrayUtils from '../utilities/ArrayUtils';
import NoteUpdateDto from './dtos/request/NoteUpdateDto';
import * as FileUtils from '../utilities/FileUtils';
import { nanoid } from 'nanoid';

@Injectable()
export class NoteService {
  private readonly logger = new Logger(NoteService.name);

  constructor(
    @InjectModel(Note.name) private noteModel: Model<NoteDocument>,
    private readonly db: Db,
    private readonly fileService: FileService,
  ) {}

  async create(session: CSession, dto: NoteCreateDto) {
    const { images: imagesDto, ...rest } = dto;
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
      images.push(...imagesDto);

      // make images not temporary files
      await this.fileService.permanentFile(_session, images);

      const newNote = new this.noteModel({
        ...rest,
        images,
      });
      const note = await newNote.save({ session: _session });

      await note.save();
      return note;
    });
  }

  async update(session: CSession, id: string, dto: NoteUpdateDto) {
    return this.db.withTransaction(session, async (_session) => {
      const oldNote = await this.findById(_session, id);
      if (!oldNote) {
        throw new BusinessError('error.note.notfound');
      }
      if (oldNote.permalink != dto.permalink) {
        if (await this.existsByPermalink(_session, dto.permalink)) {
          throw new BusinessError('error.note.duplicate-permalink');
        }
      }

      const { images: imagesDto, ...rest } = dto;

      const images = [];
      if (rest.banner) {
        images.push(rest.banner);
      }
      images.push(...imagesDto);

      const diffImages = ArrayUtils.diffBoth(
        oldNote.images,
        images,
        (oldImgId, newImgId) => oldImgId === newImgId,
      );

      const deleteImages = diffImages.left;
      await this.fileService.deleteFileByIds(_session, deleteImages);

      const newImages = diffImages.right;
      // make images not temporary files
      await this.fileService.permanentFile(_session, newImages);

      oldNote.title = rest.title;
      oldNote.permalink = rest.permalink;
      oldNote.banner = rest.banner;
      oldNote.overview = rest.overview;
      oldNote.images = images;
      oldNote.tags = rest.tags;
      oldNote.category = rest.category;
      oldNote.content = rest.content;
      oldNote.updatedAt = new Date();

      return oldNote.save({ session: _session });
    });
  }

  async publishById(session: CSession, id: string) {
    return this.db.withTransaction(session, async (_session) => {
      const note = await this.findById(_session, id);
      return this.publish(_session, note);
    });
  }

  /**
   * TODO avoid duplicated code
   *
   * @param note
   */
  saveNoteHTMLToPublishedDir(note: NoteDocument) {
    const noteComponentName = `${note.permalink}.html`;
    const file = path.join(NOTES_PUBLISHED_DIR, noteComponentName);
    FileUtils.unlinkSyncSilentEnoent(file);
    const noteContentHTML = NoteContentUtil.create(note);
    FileUtils.writeFileSync(file, noteContentHTML, { recursive: true });
  }

  /**
   * create Vue component file to the frontend project.
   */
  async publish(session: CSession, note: NoteDocument) {
    return this.db.withTransaction(session, async (_session) => {
      if (!note.publishedAt) {
        note.publishedAt = new Date();
      }
      // save note HTML to published dir
      this.saveNoteHTMLToPublishedDir(note);

      note.isPublished = true;
      note.updatePublicationAt = new Date();
      note.publishedVersion = nanoid(6);
      await note.save();
      return note;
    })
    .catch((e: Error) => {
      this.logger.error('error.publish.cantDeploy', e.message);
      throw e;
    });
  }

  republishAllNotes(session: CSession) {
    return this.db.withTransaction(session, async (_session) => {
      const notes = await this.getAllPublishedListModel(_session);
      const recreate = notes.map((note) =>
        this.publish(_session, note)
      );
      await Promise.all(recreate);
    });
  }

  deleteNoteHTMLInPublishedDir(note: NoteDocument) {
    // remove note HTML
    const file = path.join(NOTES_PUBLISHED_DIR, `${note.permalink}.html`);
    FileUtils.unlinkSyncSilentEnoent(file);
  }

  async unpublishById(session: CSession, id: string) {
    return this.db.withTransaction(session, async (_session) => {
      const note = await this.findById(_session, id);
      if (!note) {
        throw new Error('error.note.unpublish.notfound');
      }

      this.deleteNoteHTMLInPublishedDir(note);
      note.isPublished = false;
      await note.save({ session: _session });
      return note;
    })
    .catch((e: Error) => {
      this.logger.error('error.unpublish.cantDeleteNote', e.message);
      throw e;
    });
  }

  async findById(session: CSession, id: string): Promise<NoteDocument> {
    return this.db.withTransaction(session, (ss) => {
      return this.noteModel.findById(id).session(ss).exec();
    });
  }

  async findPublishedByPermalink(session: CSession, permalink: string) {
    return this.db.withTransaction(session, (ss) => {
      return this.noteModel
        .findOne({
          permalink,
          isPublished: true,
          isDeleted: false,
        })
        .session(ss)
        .exec();
    });
  }

  async existsPublishedByPermalink(session: CSession, permalink: string) {
    return this.db.withTransaction(session, (ss) => {
      return this.noteModel
        .countDocuments({
          permalink,
          isPublished: true,
          isDeleted: false,
        })
        .session(ss)
        .exec();
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

  existsByPermalink(session: CSession, permalink: string): Promise<boolean> {
    return this.db.withTransaction(session, (ss) => {
      return this.noteModel
        .countDocuments({
          permalink,
        })
        .session(ss)
        .exec();
    });
  }

  getAllPublishedListModel(session: CSession) {
    return this.db.withTransaction(session, async (ss) => {
      const condition = {
        isPublished: true,
        isDeleted: false,
      };
      return this.noteModel.find(condition).session(ss).exec();
    });
  }

  async getPublishedList(
    session: CSession,
    dto: NoteFilterListDto,
  ): Promise<PageDto<PublicNoteItemListDto>> {
    const condition = {
      isPublished: true,
      isDeleted: false,
    } as {
      isPublished: boolean;
      isDeleted: boolean;
      tags?: string;
    };
    if (dto.tag) {
      condition.tags = dto.tag;
    }

    return this.db.withTransaction(session, async (ss) => {
      const items = await this.noteModel
        .find(condition)
        .session(ss)
        .sort({ publishedAt: -1 })
        .skip(dto.getSkip())
        .limit(dto.limit)
        .exec()
        .then((results) =>
          results.map((rs) => PublicNoteItemListDto.fromEntity(rs)),
        );

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
        .aggregate([
          {
            $project: {
              _id: '$_id',
              title: '$title',
              permalink: '$permalink',
              overview: '$overview',
              tags: '$tags',
              category: '$category',
              isPublished: '$isPublished',
              publishedAt: '$publishedAt',
              updatePublicationAt: '$updatePublicationAt',
              isDeleted: '$isDeleted',
              createdAt: '$createdAt',
              updatedAt: '$updatedAt',
              newCommentsCount: {
                $size: {
                  $filter: {
                    input: '$comments',
                    cond: { $eq: ['$$this.isReaded', false] },
                  },
                },
              },
            },
          },
        ])
        .session(ss)
        .sort({ createdAt: -1 })
        .skip(dto.getSkip())
        .limit(dto.limit)
        .exec()
        .then((results) => results.map((rs) => NoteItemListDto.fromEntity(rs)));

      const count = await this.noteModel.count().exec();

      return PageDto.create(items, dto.page, dto.limit, count);
    });
  }

  async deleteById(session: CSession, id: string) {
    return this.db.withTransaction(session, async (ss) => {
      const note = await this.noteModel.findByIdAndDelete(id, { session: ss });
      if (!note) {
        throw new Error('error.note.delete.notfound');
      }

      await this.fileService.deleteFileByIds(ss, note.images);

      // delete from `fe` deployed dir
      return this.deleteNoteHTMLInPublishedDir(note);
    });
  }

  async softDeleteById(session: CSession, id: string) {
    return this.db.withTransaction(session, async (_session) => {
      const note = await this.findById(_session, id);
      if (!note) {
        throw new Error('error.note.delete.notfound');
      }

      // delete from `fe` deployed dir
      this.deleteNoteHTMLInPublishedDir(note);
      note.isDeleted = true;
      note.isPublished = false;
      await note.save({ session: _session });
      return note;
    });
  }

  async getContentPreview(session: CSession, id: string) {
    return this.db.withTransaction(session, async (ss) => {
      const note = await this.findById(ss, id);
      if (!note) {
        throw new Error('error.note.preview.notfound');
      }

      return NoteContentUtil.formatContent(note.content);
    });
  }
}
