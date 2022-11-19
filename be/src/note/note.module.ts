import { CacheModule, Module } from '@nestjs/common';
import { NoteController } from './note.controller';
import { NoteService } from './note.service';
import { MongooseModule } from '@nestjs/mongoose';
import { NoteSchema } from './entities/note.entity';
import { CommonModule } from '../common/common.module';
import { FileModule } from '../file/file.module';
import { CommentController } from './comment.controller';
import { CommentService } from './comment.service';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Note', schema: NoteSchema }]),
    CommonModule,
    FileModule,
    CacheModule.register(),
    HttpModule,
  ],
  controllers: [NoteController, CommentController],
  providers: [NoteService, CommentService],
})
export class NoteModule {}
