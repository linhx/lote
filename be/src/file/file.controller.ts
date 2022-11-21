import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { FILE_DIR, FILE_URL_PREFIX } from '../constants';
import { FileService } from './file.service';
import * as FileUtils from '../utilities/FileUtils';
import FileDto from './dtos/response/file.dto';
import * as path from 'path';
import { Response } from 'express';
import { Public } from '../auth/sso.strategy';
import { SkipThrottle } from '@nestjs/throttler';

const getYYYMM = () => {
  return new Date().toISOString().substring(0, 7);
};

@Controller(FILE_URL_PREFIX)
export class FileController {
  constructor(private readonly fileService: FileService) {}

  @Post('')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: (req, file, cb) => {
          const destination = path.join(FILE_DIR, getYYYMM());
          FileUtils.mkdirSyncIfNotExist(destination, { recursive: true });
          cb(null, destination);
        },
        filename: (req, file, cb) => {
          cb(null, FileUtils.randomFileName(file.originalname));
        },
      }),
    }),
  )
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    const cFile = await this.fileService.saveTempFile(null, file);
    return FileDto.fromEntity(cFile);
  }

  @Get(':path(*)')
  @Public()
  temp(@Param('path') filePath: string, @Res() res: Response) {
    res.sendFile(path.join(FILE_DIR, filePath), (err: any) => {
      if (err) {
        res.sendStatus(404);
      }
    });
  }
}
