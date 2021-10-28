import { Module } from '@nestjs/common';
import { NoteController } from './note.controller';
import { NoteService } from './note.service';
import { MongooseModule } from '@nestjs/mongoose';
import { NoteSchema } from './entities/Note';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Note', schema: NoteSchema }])
  ],
  controllers: [NoteController],
  providers: [NoteService],
})
export class NoteModule {}
