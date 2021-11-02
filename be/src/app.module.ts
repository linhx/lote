import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { FileModule } from './file/file.module';
import { NoteModule } from './note/note.module';
import { ConfigModule } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';
import { ScheduleModule } from '@nestjs/schedule';
import { FILE_TEMP_FOLDER, FILE_TEMP_URL_PREFIX, STATIC_FOLDER } from './constants';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true
    }),
    MongooseModule.forRoot(process.env.MONGO_DB_URL, {
      dbName: 'note',
      replicaSet: process.env.MONGO_DB_REPLICA,
    }),
    ServeStaticModule.forRoot({
      rootPath: STATIC_FOLDER,
      serveRoot: '/static',
    },{
      rootPath: FILE_TEMP_FOLDER,
      serveRoot: FILE_TEMP_URL_PREFIX,
    }),
    ScheduleModule.forRoot(),
    FileModule,
    NoteModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
