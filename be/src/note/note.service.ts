import { Injectable, Logger } from '@nestjs/common';
import { exec } from 'child_process';
import { Note, NoteDocument } from './entities/Note';
import NoteCreateDto from './dtos/request/NoteCreateDto';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import PageDto from '../dtos/response/PageDto';
import NoteItemListDto from './dtos/response/NoteItemListDto';
import PublicNoteItemListDto from './dtos/response/PublicNoteItemListDto';
import NoteFilterListDto from './dtos/request/NoteFilterListDto';
import * as fs from 'fs';
import * as path from 'path';
import { CSession, Db } from '../common/db';
import {
  NOTE_DATA_DRAFT_FOLDER,
  NOTE_IMAGES_PUBLISH_FOLDER,
  NOTE_PUBLISH_FOLDER,
  DEPLOY_NOTE_SCRIPT,
  UNPULISH_NOTE_SCRIPT,
} from 'src/constants';
import BusinessError from 'src/exceptions/BusinessError';
import { FileService } from '../file/file.service';
import HtmlUtils from './utilities/HtmlUtils';
import * as NoteComponent from './utilities/NoteComponent';
import * as StringUtils from '../utilites/StringUtils';
import * as ArrayUtils from '../utilites/ArrayUtils';
import NoteDto from './dtos/response/NoteDto';
import NoteUpdateDto from './dtos/request/NoteUpdateDto';
import * as FileUtils from '../utilites/FileUtils';

@Injectable()
export class NoteService {
  private readonly logger = new Logger(NoteService.name);

  constructor(
    @InjectModel(Note.name) private noteModel: Model<NoteDocument>,
    private readonly db: Db,
    private readonly fileService: FileService,
  ) {}

  private createNoteDraftFolder(id: string) {
    return path.join(NOTE_DATA_DRAFT_FOLDER, id)
  }

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
      const folder = this.createNoteDraftFolder(`${note._id}`);
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

  async update(session: CSession, id: string, dto: NoteUpdateDto) {
    return this.db.withTransaction(session, async (_session) => {
      const oldNote = await this.findById(_session, id);
      if (!oldNote) {
        throw new BusinessError('error.note.notfound');
      }
      const { content, ...rest } = dto;

      const images = [];
      if (rest.banner) {
        images.push(rest.banner);
      }
      for (let op of content.ops) {
        if (op.insert?.imagec) {
          images.push(op.insert?.imagec.id);
        }
      }

      const diffImages = ArrayUtils.diffBoth(
        oldNote.images,
        images,
        (oldImgId, newImgId) => oldImgId === newImgId,
      );

      const deleteImages = diffImages.left;
      this.fileService.deleteFileByIds(_session, deleteImages);

      const newImages = diffImages.right;
      // make images not temporary files
      await this.fileService.permanentFile(_session, newImages);

      oldNote.title = rest.title;
      oldNote.permalink = rest.permalink;
      oldNote.banner = rest.banner;
      oldNote.overview = rest.overview;
      oldNote.overview = rest.overview;
      oldNote.images = images;
      oldNote.tags = rest.tags;
      oldNote.category = rest.category;
      oldNote.updatedAt = new Date();

      fs.writeFileSync(oldNote.content, JSON.stringify(content));

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
   * build notes component in the `fe` project then copy the result to the `fe` deployed dir
   */
  publishNotes() {
    return new Promise((resolve, reject) => {
      if (DEPLOY_NOTE_SCRIPT) {
        exec(DEPLOY_NOTE_SCRIPT, (error, stdout, stderr) => {
          if (error) {
            this.logger.error(`error: ${error.message}`);
            reject(error);
            return;
          }
          if (stderr) {
            this.logger.log(`stderr: ${stderr}`);
            reject(stderr);
            return;
          }
          resolve(true);
        });
      } else {
        resolve(true);
      }
    });
  }

  /**
   * create Vue component file to the frontend project. and copy images to the frontend project
   */
  async publish(session: CSession, note: NoteDocument) {
    return this.db.withTransaction(session, async (_session) => {
      const noteComponentFolder = NOTE_PUBLISH_FOLDER;

      // create note as vue component into the `fe` source code dir
      const file = path.join(noteComponentFolder, `${note.permalink}.vue`);
      FileUtils.unlinkSyncSilentEnoent(file);
      const contentJson = fs.readFileSync(note.content, { encoding: 'utf8' });
      fs.writeFileSync(file, NoteComponent.create(note, JSON.parse(contentJson)));

      // replace new images
      const imageFiles = await this.fileService.findByIds(
        _session,
        note.images,
      );
      const imagesFolder = path.join(NOTE_IMAGES_PUBLISH_FOLDER, note.permalink);
      fs.rmdirSync(imagesFolder, { recursive: true });
      fs.mkdirSync(imagesFolder, {
        recursive: true,
      });
      for (const imageFile of imageFiles) {
        fs.copyFileSync(
          imageFile.path,
          path.join(
            imagesFolder,
            `${imageFile.publishName}`,
          ),
        );
      }

      const publish = this.publishNotes();
      publish.then(() => {
        note.isDeleted = false;
        note.isPublished = true;
        if (!note.publishedAt) {
          note.publishedAt = new Date();
        }
        note.updatePublicationAt = new Date();
        return note.save();
      })

      return note;
    });
  }


  deleteDeloyedNote(note: NoteDocument) {
    // remove note component
    const file = path.join(NOTE_PUBLISH_FOLDER, `${note.permalink}.vue`);
    FileUtils.unlinkSyncSilentEnoent(file);

    // remove note's images
    const imagesFolder = path.join(NOTE_IMAGES_PUBLISH_FOLDER, note.permalink);
    FileUtils.rmSyncSilentEnoent(imagesFolder, { recursive: true });

    return new Promise((resolve, reject) => {
      if (UNPULISH_NOTE_SCRIPT) {
        exec(`${UNPULISH_NOTE_SCRIPT} "${note.permalink}"`, (error, stdout, stderr) => {
          if (error) {
            this.logger.error(`error: ${error.message}`);
            reject(error);
            return;
          }
          if (stderr) {
            this.logger.log(`stderr: ${stderr}`);
            reject(stderr);
            return;
          }
          resolve(true);
        });
      } else {
        resolve(true);
      }
    });
  }

  async unpublishById(session: CSession, id: string) {
    return this.db.withTransaction(session, async (_session) => {
      const note = await this.findById(_session, id);
      if (!note) {
        throw new Error('error.note.unpublish.notfound');
      }

      // delete from `fe` deployed dir, and remove from note-chunk-map
      const publish = this.deleteDeloyedNote(note);
      publish.then(() => {
        note.isPublished = false;
        return note.save();
      });

      return note;
    });
  }

  async findById(session: CSession, id: string): Promise<NoteDocument> {
    return this.db.withTransaction(session, (ss) => {
      return this.noteModel.findById(id).session(ss).exec();
    });
  }

  async findIncludeContentById(session: CSession, id: string) {
    const note = await this.findById(session, id);
    if (!note) {
      throw new BusinessError('error.note.notfound');
    }
    const contentJson = fs.readFileSync(note.content, { encoding: 'utf8' });
    return NoteDto.fromEntity(note, contentJson);
  }

  async findPublisedByPermalink(session: CSession, permalink: string) {
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
        .count({
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
  ): Promise<PageDto<PublicNoteItemListDto>> {
    const condition = {
      isPublished: true,
      isDeleted: false,
    };

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
        .find()
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

      const draftFolder = this.createNoteDraftFolder(`${note._id}`);
      fs.rmdirSync(draftFolder, { recursive: true });

      // delete from `fe` deployed dir, and remove from note-chunk-map
      return this.deleteDeloyedNote(note);
    });
  }

  async softDeleteById(session: CSession, id: string) {
    return this.db.withTransaction(session, async (_session) => {
      const note = await this.findById(_session, id);
      if (!note) {
        throw new Error('error.note.delete.notfound');
      }

      // delete from `fe` deployed dir, and remove from note-chunk-map
      const publish = this.deleteDeloyedNote(note);
      publish.then(() => {
        note.isDeleted = true;
        note.isPublished = false;
        return note.save();
      });

      return note;
    });
  }

  async getContentPreview(session: CSession, id: string) {
    return this.db.withTransaction(session, async (ss) => {
      const note = await this.findById(ss, id);
      if (!note) {
        throw new Error('error.note.preview.notfound');
      }

      const contentJson = fs.readFileSync(note.content, { encoding: 'utf8' });
      return HtmlUtils.deltaToPreviewHtml(JSON.parse(contentJson));
    });
  }
}
