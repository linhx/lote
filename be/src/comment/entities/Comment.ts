import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { Document } from 'mongoose';
import { Note } from 'src/note/entities/Note';

export type CommentDocument = Comment & Document;

@Schema()
export class Comment {
  _id: mongoose.Schema.Types.ObjectId;

  @Prop({ required: true, type: mongoose.Schema.Types.ObjectId, ref: 'Note' })
  note: Note;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' })
  parent: Comment;

  @Prop({ required: true })
  author: string;

  @Prop({ required: true })
  content: string;

  @Prop({ default: Date.now })
  postedAt: Date;

  @Prop({ default: false })
  isActive: boolean;
}

export const CommentSchema = SchemaFactory.createForClass(Comment);
