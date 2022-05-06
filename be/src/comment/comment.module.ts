import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CommonModule } from 'src/common/common.module';
import { NoteModule } from 'src/note/note.module';
import { CommentController } from './comment.controller';
import { CommentService } from './comment.service';
import { CommentSchema } from './entities/Comment';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Comment', schema: CommentSchema }]),
    CommonModule,
    NoteModule,
  ],
  controllers: [CommentController],
  providers: [CommentService],
})
export class CommentModule {}
