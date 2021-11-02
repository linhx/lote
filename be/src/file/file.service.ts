import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CSession, Db } from '../common/db';
import { File, FileDocument } from "./entities/File";

@Injectable()
export class FileService {
  constructor(
    @InjectModel(File.name) private fileModel: Model<FileDocument>,
    private db: Db,
  ) {}

  saveTempFile(session: CSession, file: Express.Multer.File) {
    return this.db.withTransaction(session, (_session) => {
      const fileModel = new this.fileModel({
        name: file.originalname,
        type: file.mimetype,
        size: file.size,
        path: file.path,
      });

      return fileModel.save({ session: _session });
    });
  }
}
