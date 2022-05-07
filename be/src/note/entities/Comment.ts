import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { Document } from 'mongoose';

export type CommentDocument = Comment & Document;

@Schema()
export class Comment {
  _id: mongoose.Schema.Types.ObjectId;

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

  @Prop({ default: false })
  isReaded: boolean;
}

export const CommentSchema = SchemaFactory.createForClass(Comment);
