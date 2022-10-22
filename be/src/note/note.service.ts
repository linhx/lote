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
import * as path from 'path';
import { CSession, Db } from '../common/db';
import {
  NOTE_PUBLISH_DIR,
  DEPLOY_NOTE_SCRIPT,
  UNPULISH_NOTE_SCRIPT,
  SINGLE_NOTE_PUBLISH_DIR,
  DEPLOY_NOTES_SCRIPT,
  DEPLOY_FE_SCRIPT,
} from 'src/constants';
import BusinessError from 'src/exceptions/BusinessError';
import { FileService } from '../file/file.service';
import * as NoteComponent from './utilities/NoteComponent';
import * as ArrayUtils from '../utilites/ArrayUtils';
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
   * build note component in the `fe` project then copy the result to the `fe` deployed dir
   */
  publishNote() {
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
   * build notes component in the `fe` project then copy the result to the `fe` deployed dir
   */
  publishNotes() {
    const deploy = new Promise((resolve, reject) => {
      if (DEPLOY_NOTES_SCRIPT) {
        exec(DEPLOY_NOTES_SCRIPT, (error, stdout, stderr) => {
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
    deploy.catch((e: Error) => {
      this.logger.error('error.publishNotes.cantDeploy', e.message);
    });
  }

  /**
   * build notes component in the `fe` project then copy the result to the `fe` deployed dir
   */
  deployFe() {
    const deploy = new Promise((resolve, reject) => {
      if (DEPLOY_FE_SCRIPT) {
        exec(DEPLOY_FE_SCRIPT, (error, stdout, stderr) => {
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
    deploy.catch((e: Error) => {
      this.logger.error('error.deployFe.cantDeploy', e.message);
    });
  }

  /**
   * TODO avoid duplicated code
   *
   * @param note
   */
  saveNoteComponentToPublishDir(note: NoteDocument) {
    const noteComponentName = `${note.permalink}.vue`;
    const file = path.join(NOTE_PUBLISH_DIR, noteComponentName);
    const noteComponent = NoteComponent.create(note);
    FileUtils.writeFileSync(file, noteComponent, { recursive: true });
  }

  saveNoteComponent(note: NoteDocument) {
    // create note as vue component into the `fe` source code dir

    // save to the directory where all the notes are saved
    const noteComponentName = `${note.permalink}.vue`;
    const file = path.join(NOTE_PUBLISH_DIR, noteComponentName);
    const noteComponent = NoteComponent.create(note);
    FileUtils.writeFileSync(file, noteComponent, { recursive: true });

    // save to the directory for one note
    const singleNoteComponentDir = SINGLE_NOTE_PUBLISH_DIR;
    FileUtils.rmSyncInsideSilentEnoent(singleNoteComponentDir, {
      recursive: true,
    });
    const singleNoteComponentFile = path.join(
      singleNoteComponentDir,
      noteComponentName,
    );
    FileUtils.writeFileSync(singleNoteComponentFile, noteComponent, {
      recursive: true,
    });
  }

  recreateAndPublishNotes(session: CSession) {
    return this.db.withTransaction(session, async (ss) => {
      const notes = await this.getAllPublishedListModel(ss);
      const recreate = notes.map((note) =>
        this.saveNoteComponentToPublishDir(note),
      );
      await Promise.all(recreate);

      this.publishNotes();
    });
  }

  /**
   * create Vue component file to the frontend project. and copy images to the frontend project
   */
  async publish(session: CSession, note: NoteDocument) {
    return this.db.withTransaction(session, async (_session) => {
      if (!note.publishedAt) {
        note.publishedAt = new Date();
      }

      // clean the directory of single note
      const singleNoteComponentDir = SINGLE_NOTE_PUBLISH_DIR;
      FileUtils.rmSyncInsideSilentEnoent(singleNoteComponentDir, {
        recursive: true,
      });

      // save note component
      this.saveNoteComponent(note);

      // TODO remove unused image

      await note.save();

      const publish = this.publishNote();
      publish
        .then(() => {
          return this.noteModel.findByIdAndUpdate(note.id, {
            isDeleted: false,
            isPublished: true,
            updatePublicationAt: new Date(),
          }).exec();
        })
        .catch((e: Error) => {
          this.logger.error('error.publish.cantDeploy', e.message);
        });

      return note;
    });
  }

  deletePublishedNote(note: NoteDocument) {
    // remove note component
    const file = path.join(NOTE_PUBLISH_DIR, `${note.permalink}.vue`);
    FileUtils.unlinkSyncSilentEnoent(file);

    return new Promise((resolve, reject) => {
      if (UNPULISH_NOTE_SCRIPT) {
        exec(
          `${UNPULISH_NOTE_SCRIPT} "${note.permalink}"`,
          (error, stdout, stderr) => {
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
          },
        );
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
      const publish = this.deletePublishedNote(note);
      publish
        .then(() => {
          return this.noteModel.findByIdAndUpdate(note.id, {
            isPublished: false,
          }).exec();
        })
        .catch((e: Error) => {
          this.logger.error('error.unpublish.cantDeleteNote', e.message);
        });

      return note;
    });
  }

  async findById(session: CSession, id: string): Promise<NoteDocument> {
    return this.db.withTransaction(session, (ss) => {
      return this.noteModel.findById(id).session(ss).exec();
    });
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

      // delete from `fe` deployed dir, and remove from note-chunk-map
      return this.deletePublishedNote(note);
    });
  }

  async softDeleteById(session: CSession, id: string) {
    return this.db.withTransaction(session, async (_session) => {
      const note = await this.findById(_session, id);
      if (!note) {
        throw new Error('error.note.delete.notfound');
      }

      // delete from `fe` deployed dir, and remove from note-chunk-map
      const publish = this.deletePublishedNote(note);
      publish
        .then(() => {
          return this.noteModel.findByIdAndUpdate(note.id, {
            isDeleted: true,
            isPublished: true,
          }).exec();
        })
        .catch((e: Error) => {
          this.logger.error('error.soltDelete.cantDeleteNote', e.message);
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

      return note.content;
    });
  }
}
