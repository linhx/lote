import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { Model } from 'mongoose';
import { CSession, Db } from '../common/db';
import BusinessError from '../exceptions/business.error';
import { NoteService } from './note.service';
import CommentCreateDto from './dtos/request/comment-create.dto';
import { NoteDocument, Note } from './entities/note.entity';
import { Comment } from './entities/comment.entity';

@Injectable()
export class CommentService {
  private readonly logger = new Logger(CommentService.name);

  constructor(
    @InjectModel(Note.name) private noteModel: Model<NoteDocument>,
    private readonly db: Db,
    private readonly noteService: NoteService,
  ) {}

  async existsRootComment(session: CSession, note: NoteDocument, id: string) {
    return this.db.withTransaction(session, (_session) => {
      return this.noteModel
        .countDocuments({
          _id: note.id,
          'comments._id': new mongoose.Types.ObjectId(id),
          'comments.isActive': true,
          'comments.parent': null,
        })
        .session(_session)
        .exec();
    });
  }

  create(
    session: CSession,
    note: NoteDocument,
    dto: CommentCreateDto,
    isActive = false,
  ) {
    return this.db.withTransaction(session, async (_session) => {
      let parent = null;
      if (dto.parentId) {
        const existRootComment = await this.existsRootComment(
          _session,
          note,
          dto.parentId,
        );
        if (!existRootComment) {
          throw new BusinessError('error.comment.create.parentDoesNotExist');
        }
        parent = new mongoose.Types.ObjectId(dto.parentId);
      }

      const newComment = new Comment();
      newComment.parent = parent;
      newComment.content = dto.content;
      newComment.author = dto.author;
      newComment.isActive = isActive;
      newComment.isReaded = isActive;

      note.comments.push(newComment);

      const notRes = await note.save({ session: _session });
      return notRes.comments[notRes.comments.length - 1];
    });
  }

  createByPermalink(
    session: CSession,
    permalink: string,
    dto: CommentCreateDto,
  ) {
    return this.db.withTransaction(session, async (_session) => {
      const note = await this.noteService.findPublishedByPermalink(
        _session,
        permalink,
      );
      if (!note) {
        throw new BusinessError('error.comment.create.noteDoesNotExist');
      }

      return this.create(_session, note, dto);
    });
  }

  createByNoteId(session: CSession, noteId: string, dto: CommentCreateDto) {
    return this.db.withTransaction(session, async (_session) => {
      const note = await this.noteService.findById(_session, noteId);
      if (!note) {
        throw new BusinessError('error.comment.create.noteDoesNotExist');
      }

      return this.create(_session, note, dto, true);
    });
  }

  getAllActiveByPermalink(session: CSession, permalink: string) {
    return this.db.withTransaction(session, async (_session) => {
      const note = await this.noteModel
        .aggregate([
          {
            $match: { permalink, isPublished: true, isDeleted: false },
          },
          {
            $project: {
              _id: '$_id',
              comments: {
                $filter: {
                  input: '$comments',
                  as: 'comment',
                  cond: {
                    $eq: ['$$comment.isActive', true],
                  },
                },
              },
            },
          },
        ])
        .session(_session)
        .exec();

      if (!note.length)
        throw new BusinessError('error.comment.list.noteDoesNotExist');

      return note[0].comments;
    });
  }

  getAllByNoteId(session: CSession, noteId: string) {
    return this.db.withTransaction(session, async (_session) => {
      const note = await this.noteModel
        .findById(noteId)
        .select('comments')
        .session(_session)
        .exec();

      if (!note) throw new BusinessError('error.comment.list.noteDoesNotExist');

      return note.comments;
    });
  }

  active(session: CSession, noteId: string, id: string) {
    return this.db.withTransaction(session, async (_session) => {
      return this.noteModel
        .updateOne(
          {
            _id: new mongoose.Types.ObjectId(noteId),
            'comments._id': new mongoose.Types.ObjectId(id),
          },
          {
            $set: { 'comments.$.isActive': true, 'comments.$.isReaded': true },
          },
        )
        .session(_session)
        .exec();
    });
  }

  delete(session: CSession, noteId: string, id: string) {
    return this.db.withTransaction(session, async (_session) => {
      await this.noteModel
        .findByIdAndUpdate(noteId, {
          $pull: {
            comments: { _id: new mongoose.Types.ObjectId(id) },
          },
        })
        .session(_session)
        .exec();

      await this.noteModel
        .findByIdAndUpdate(noteId, {
          $pull: {
            comments: { parent: new mongoose.Types.ObjectId(id) },
          },
        })
        .session(_session)
        .exec();
    });
  }
}
