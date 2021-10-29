import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { NoteModule } from './note/note.module';

@Module({
  imports: [
    MongooseModule.forRoot(process.env.MONGO_DB_URL, {
      dbName: 'note'
    }),
    NoteModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
