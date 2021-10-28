import { Module } from '@nestjs/common';
import { NoteController } from './controllers/note.controller';
import { NoteService } from './services/note.service';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [],
  controllers: [NoteController],
  providers: [NoteService],
})
export class AppModule {}
