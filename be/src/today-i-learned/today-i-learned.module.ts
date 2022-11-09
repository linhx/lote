import { CacheModule, Module } from '@nestjs/common';
import { TodayILearnedController } from './today-i-learned.controller';
import { TodayILearnedService } from './today-i-learned.service';
import { MongooseModule } from '@nestjs/mongoose';
import { TodayILearnedSchema } from './entities/today-i-learned.entity';
import { CommonModule } from '../common/common.module';
import { FileModule } from '../file/file.module';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'TodayILearned', schema: TodayILearnedSchema }]),
    CommonModule,
    FileModule,
    CacheModule.register(),
    HttpModule,
  ],
  controllers: [TodayILearnedController],
  providers: [TodayILearnedService],
})
export class TodayILearnedModule {}
