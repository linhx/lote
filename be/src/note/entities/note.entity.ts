import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { CommentSchema, Comment } from './comment.entity';

export type NoteDocument = Note & Document;

@Schema()
export class Note {
  @Prop({ required: true, unique: true })
  permalink: string;

  @Prop({ required: true })
  title: string;

  @Prop()
  banner: string;

  @Prop()
  overview: string;

  @Prop()
  tags: string[];

  @Prop()
  category: number;

  @Prop()
  images: string[];

  @Prop()
  content: string;

  @Prop({ default: false })
  isPublished: boolean;

  @Prop()
  publishedAt: Date;

  @Prop()
  publishedVersion: string;

  @Prop()
  updatePublicationAt: Date;

  @Prop({ default: false })
  isDeleted: boolean;

  @Prop({ default: Date.now })
  createdAt: Date;

  @Prop({ default: Date.now })
  updatedAt: Date;

  @Prop({ type: [CommentSchema], default: [] })
  comments: Comment[];
}

export const NoteSchema = SchemaFactory.createForClass(Note);
