import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CSession, Db } from '../common/db';
import { CFile, CFileDocument } from './entities/CFile';
import { Cron } from '@nestjs/schedule';
import * as DateTimeUtils from '../utilites/DateTimeUtils';
import * as fs from 'fs';
import * as path from 'path';
import { FILE_TEMP_URL_PREFIX } from 'src/constants';

@Injectable()
export class FileService {
  private readonly logger = new Logger(FileService.name);

  constructor(
    @InjectModel(CFile.name) private fileModel: Model<CFileDocument>,
    private db: Db,
  ) {}

  @Cron(process.env.FILE_TEMP_DELETE_SCHEDULER)
  async handleCron() {
    await this.db.withTransaction(null, async (_session) => {
      const expiredTempFiles = await this.fileModel
        .find({
          isTemp: true,
          createdAt: {
            $lt: DateTimeUtils.addDays(new Date(), -7),
          },
        })
        .session(_session)
        .exec();

      const promisesDeleteTempFile = expiredTempFiles.map((e) => {
        return new Promise((resolve, reject) => {
          try {
            fs.unlinkSync(e.path);
          } catch (e) {
            this.logger.error('error.file.cantDeleteTemp', e.stack);
            resolve(false);
            return;
          }
          this.deleteFile(_session, e)
            .then(() => {
              resolve(true);
            })
            .catch((e) => {
              this.logger.error('error.file.cantDeleteTempDb', e.stack);
              resolve(false);
            });
        });
      });

      await Promise.all(promisesDeleteTempFile);
    });
  }

  deleteFile(session: CSession, file: CFileDocument) {
    return this.db.withTransaction(session, (_session) => {
      return this.fileModel
        .findByIdAndDelete(file._id)
        .session(_session)
        .exec();
    });
  }

  saveTempFile(session: CSession, file: Express.Multer.File) {
    return this.db.withTransaction(session, (_session) => {
      const fileModel = new this.fileModel({
        name: file.originalname,
        publishName: file.filename,
        type: file.mimetype,
        size: file.size,
        path: file.path,
        url: path.join(FILE_TEMP_URL_PREFIX, file.filename),
        isTemp: true,
      });

      return fileModel.save({ session: _session });
    });
  }

  permanentFile(session: CSession, filesId: string[]) {
    if (!filesId || filesId.length === 0) {
      return null;
    }
    return this.db.withTransaction(session, (_session) => {
      return this.fileModel.updateMany(
        {
          _id: {
            $in: filesId,
          },
        },
        {
          isTemp: false,
        },
        {
          session: _session,
        },
      );
    });
  }

  findByIds(session: CSession, filesId: string[]): Promise<CFileDocument[]> {
    return this.db.withTransaction(session, (_session) => {
      return this.fileModel
        .find({
          _id: {
            $in: filesId,
          },
        })
        .session(_session)
        .exec();
    });
  }
}
