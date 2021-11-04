import { Module } from '@nestjs/common';
import { NoteController } from './note.controller';
import { NoteService } from './note.service';
import { MongooseModule } from '@nestjs/mongoose';
import { NoteSchema } from './entities/Note';
import { CommonModule } from '../common/common.module';
import { FileModule } from "../file/file.module";

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Note', schema: NoteSchema }]),
    CommonModule,
    FileModule,
  ],
  controllers: [NoteController],
  providers: [NoteService],
})
export class NoteModule {}
