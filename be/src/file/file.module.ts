import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CommonModule } from '../common/common.module';
import { EmojiController } from './emoji.controller';
import { EmojiService } from './emoji.service';
import { CFileSchema } from './entities/cfile.entity';
import { EmojiSchema } from './entities/emoji.entity';
import { FileController } from './file.controller';
import { FileService } from './file.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'CFile', schema: CFileSchema }]),
    MongooseModule.forFeature([{ name: 'Emoji', schema: EmojiSchema }]),
    CommonModule,
  ],
  controllers: [FileController, EmojiController],
  providers: [FileService, EmojiService],
  exports: [FileService],
})
export class FileModule {}
