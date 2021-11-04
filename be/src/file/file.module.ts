import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CommonModule } from '../common/common.module';
import { CFileSchema } from './entities/CFile';
import { FileController } from './file.controller';
import { FileService } from './file.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'CFile', schema: CFileSchema }]),
    CommonModule,
  ],
  controllers: [FileController],
  providers: [FileService],
  exports: [FileService]
})
export class FileModule {}
