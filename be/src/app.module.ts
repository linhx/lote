import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { FileModule } from './file/file.module';
import { NoteModule } from './note/note.module';
import { ConfigModule } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';
import { ScheduleModule } from '@nestjs/schedule';
import {
  FILE_TEMP_FOLDER,
  FILE_TEMP_URL_PREFIX,
  STATIC_FOLDER,
  STATIC_URL_PREFIX,
} from './constants';
import { AuthModule } from './auth/auth.module';
import { APP_GUARD } from '@nestjs/core';
import { SsoAuthGuard } from './auth/oauth2.strategy';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRoot(process.env.MONGO_DB_URL, {
      dbName: 'note',
      replicaSet: process.env.MONGO_DB_REPLICA,
    }),
    ServeStaticModule.forRoot(
      {
        rootPath: STATIC_FOLDER,
        serveRoot: STATIC_URL_PREFIX,
      },
      {
        rootPath: FILE_TEMP_FOLDER,
        serveRoot: FILE_TEMP_URL_PREFIX,
      },
    ),
    ScheduleModule.forRoot(),
    FileModule,
    NoteModule,
    AuthModule,
  ],
  controllers: [],
  providers: [{
    provide: APP_GUARD,
    useClass: SsoAuthGuard,
  }],
})
export class AppModule {}
