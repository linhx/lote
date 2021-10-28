import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type NoteDocument = Note & Document;

@Schema()
export class Note {
  @Prop({ required: true })
  permalink: string;

  @Prop({ required: true })
  title: string;

  @Prop()
  overview: string;

  @Prop({ default: false })
  isPublished: boolean;

  @Prop({ default: false })
  isDeleted: boolean;

  @Prop({ default: Date.now })
  createdAt: Date;

  @Prop({ default: Date.now })
  updatedAt: Date;
}

export const NoteSchema = SchemaFactory.createForClass(Note);
