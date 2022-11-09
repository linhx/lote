import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type TodayILearnedDocument = TodayILearned & Document;

@Schema()
export class TodayILearned {
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
  updatePublicationAt: Date;

  @Prop({ default: false })
  isDeleted: boolean;

  @Prop({ default: Date.now })
  createdAt: Date;

  @Prop({ default: Date.now })
  updatedAt: Date;
}

export const TodayILearnedSchema = SchemaFactory.createForClass(TodayILearned);
