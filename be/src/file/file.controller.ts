import {
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
import { FILE_TEMP_DIR } from 'src/constants';
import { FileService } from './file.service';
import * as FileUtils from '../utilites/FileUtils';
import FileDto from './dtos/response/FileDto';
import * as path from 'path';
import { Response } from 'express';

@Controller('files')
export class FileController {
  constructor(private readonly fileService: FileService) {}

  @Post('temp')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: FILE_TEMP_DIR,
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

  @Get('temp/:path(*)')
  temp(@Param('path') filePath: string, @Res() res: Response) {
    res.sendFile(path.join(FILE_TEMP_DIR, filePath), (err: any) => {
      if (err) {
        res.sendStatus(404);
      }
    });
  }
}
