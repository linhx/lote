import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type EmojiDocument = Emoji & Document;

@Schema()
export class Emoji {
  @Prop({ required: true })
  group: string;

  @Prop({ required: true })
  groupName: string;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  key: string;

  @Prop({ required: true })
  type: string;

  @Prop()
  url: string;

  @Prop()
  path: string;

  @Prop({ default: Date.now })
  createdAt: Date;

  @Prop({ default: Date.now })
  updatedAt: Date;
}

export const EmojiSchema = SchemaFactory.createForClass(Emoji);
