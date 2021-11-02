import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CommonModule } from '../common/common.module';
import { FileSchema } from './entities/File';
import { FileController } from './file.controller';
import { FileService } from './file.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'File', schema: FileSchema }]),
    CommonModule,
  ],
  controllers: [FileController],
  providers: [FileService],
})
export class FileModule {}
