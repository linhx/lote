import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { FILE_TEMP_FOLDER } from 'src/constants';
import { FileService } from './file.service';
import * as FileUtils from '../utilites/FileUtils';

@Controller('files')
export class FileController {
  constructor(private readonly fileService: FileService) {}

  @Post('temp')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: FILE_TEMP_FOLDER,
        filename: (req, file, cb) => {
          cb(null, FileUtils.randomFileName(file.originalname));
        },
      }),
    }),
  )
  uploadFile(@UploadedFile() file: Express.Multer.File) {
    return this.fileService.saveTempFile(null, file);
  }
}
