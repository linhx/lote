import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { FileModule } from './file/file.module';
import { NoteModule } from './note/note.module';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { AuthModule } from './auth/auth.module';
import { APP_GUARD } from '@nestjs/core';
import { SsoAuthGuard } from './auth/sso.strategy';
import { CommentModule } from './comment/comment.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRoot(process.env.MONGO_DB_URL, {
      dbName: 'note',
      replicaSet: process.env.MONGO_DB_REPLICA,
    }),
    ScheduleModule.forRoot(),
    FileModule,
    NoteModule,
    CommentModule,
    AuthModule,
  ],
  controllers: [],
  providers: [{
    provide: APP_GUARD,
    useClass: SsoAuthGuard,
  }],
})
export class AppModule {}
