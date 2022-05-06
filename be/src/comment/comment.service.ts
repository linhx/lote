import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { Model } from 'mongoose';
import { CSession, Db } from 'src/common/db';
import BusinessError from 'src/exceptions/BusinessError';
import { NoteService } from 'src/note/note.service';
import CommentCreateDto from './dtos/CommentCreateDto';
import { CommentDocument, Comment } from './entities/Comment';

@Injectable()
export class CommentService {
  private readonly logger = new Logger(CommentService.name);

  constructor(
    @InjectModel(Comment.name) private commentModel: Model<CommentDocument>,
    private readonly db: Db,
    private readonly noteService: NoteService,
  ) {}

  async existsRootComment(session: CSession, id: string) {
    return this.db.withTransaction(session, (_session) => {
      return this.commentModel
        .countDocuments({
          _id: new mongoose.Types.ObjectId(id),
          parent: null,
          isActive: true,
        })
        .session(_session)
        .exec();
    });
  }

  create(session: CSession, permalink: string, dto: CommentCreateDto) {
    return this.db.withTransaction(session, async (_session) => {
      const note = await this.noteService.findPublisedByPermalink(
        _session,
        permalink,
      );
      if (!note) {
        throw new BusinessError('error.comment.create.noteDoesNotExist');
      }

      let parent = null;
      if (dto.parentId) {
        const existRootComment = await this.existsRootComment(
          _session,
          dto.parentId,
        );
        if (!existRootComment) {
          throw new BusinessError('error.comment.create.parentDoesNotExist');
        }
        parent = new mongoose.Types.ObjectId(dto.parentId);
      }

      const newComment = new this.commentModel({
        note,
        parent,
        content: dto.content,
        author: dto.author,
      });
      return newComment.save({ session: _session });
    });
  }

  getAllByPermalink(session: CSession, permalink: string) {
    return this.db.withTransaction(session, async (_session) => {
      const note = await this.noteService.findPublisedByPermalink(
        _session,
        permalink,
      );
      if (!note) throw new BusinessError('error.comment.list.noteDoesNotExist');

      return this.commentModel
        .find({
          note,
          isActive: true,
        })
        .session(_session)
        .exec();
    });
  }
}
