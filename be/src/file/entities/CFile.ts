import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type CFileDocument = CFile & Document;

@Schema()
export class CFile {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  type: string;

  @Prop()
  size: number;

  @Prop()
  path: string;

  @Prop()
  url: string;

  @Prop({ default: false })
  isTemp: boolean;

  @Prop({ default: false })
  isDeleted: boolean;

  @Prop({ default: Date.now })
  createdAt: Date;

  @Prop({ default: Date.now })
  updatedAt: Date;
}

export const CFileSchema = SchemaFactory.createForClass(CFile);
