import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CSession, Db } from '../common/db';
import { CFile, CFileDocument } from './entities/cfile.entity';
import { Cron } from '@nestjs/schedule';
import * as DateTimeUtils from '../utilities/DateTimeUtils';
import * as FileUtils from '../utilities/FileUtils';
import * as path from 'path';
import { BASE_URL, FILE_DIR, FILE_URL_PREFIX } from '../constants';

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
            FileUtils.unlinkSyncSilentEnoent(e.path);
          } catch (err) {
            this.logger.error('error.file.cantDeleteTemp', err.stack);
            resolve(false);
            return;
          }
          this.deleteFile(_session, e)
            .then(() => {
              resolve(true);
            })
            .catch((err) => {
              this.logger.error('error.file.cantDeleteTempDb', err.stack);
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

  async deleteFileById(session: CSession, id: string) {
    const deletedFile = await this.db.withTransaction(session, (_session) => {
      return this.fileModel.findByIdAndDelete(id).session(_session).exec();
    });

    if (deletedFile) {
      FileUtils.unlinkSyncSilentEnoent(deletedFile.path);
    }
    return deletedFile;
  }

  async deleteFileByIds(session: CSession, ids: string[]) {
    return this.db.withTransaction(session, (_session) => {
      const allPromises = ids.map((id) => {
        return new Promise((resolve, reject) => {
          this.deleteFileById(_session, id)
            .then((rs) => resolve(rs))
            .catch((e) => reject(e));
        });
      });

      return Promise.all(allPromises);
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
        url: new URL(
          path.join(FILE_URL_PREFIX, file.path.replace(FILE_DIR, '')),
          BASE_URL,
        ).href,
        isTemp: true,
      });

      return fileModel.save({ session: _session });
    });
  }

  permanentFile(session: CSession, filesId: string[]) {
    if (!filesId || filesId.length === 0) {
      return null;
    }
    return this.db.withTransaction(session, async (_session) => {
      return this.fileModel.updateMany(
        {
          _id: {
            $in: filesId,
          },
        },
        {
          isTemp: false,
          updatedAt: new Date(),
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

  findById(session: CSession, fileId: string): Promise<CFileDocument> {
    return this.db.withTransaction(session, (_session) => {
      return this.fileModel.findById(fileId).session(_session).exec();
    });
  }
}
