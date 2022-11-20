import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { FILE_DIR, FILE_URL_PREFIX, PATH_EMOJIS } from 'src/constants';
import { CSession, Db } from '../common/db';
import EmojiCreateDto from './dtos/request/emoji-create.dto';
import { Emoji, EmojiDocument } from './entities/emoji.entity';
import * as path from 'path';
import BusinessError from 'src/exceptions/business.error';
import EmojiUpdateDto from './dtos/request/emoji-update.dto';
import * as FileUtils from '../utilities/FileUtils';

@Injectable()
export class EmojiService {
  private readonly logger = new Logger(EmojiService.name);

  constructor(
    @InjectModel(Emoji.name) private emojiModel: Model<EmojiDocument>,
    private db: Db,
  ) {}

  save(session: CSession, dto: EmojiCreateDto, file: Express.Multer.File) {
    return this.db
      .withTransaction(session, (_session) => {
        const emojiModel = new this.emojiModel({
          group: dto.group,
          groupName: dto.groupName,
          name: dto.name,
          key: dto.key,
          url: path.join(
            FILE_URL_PREFIX,
            file.destination.replace(FILE_DIR, ''),
            file.filename,
          ),
          type: file.mimetype,
          path: file.path,
        });

        return emojiModel.save({ session: _session });
      })
      .catch((e) => {
        FileUtils.unlinkSyncSilentEnoent(file.path);
        throw e;
      });
  }

  findAll() {
    return this.emojiModel.find();
  }

  findById(session: CSession, id: string) {
    return this.emojiModel.findById(id);
  }

  async update(
    session: CSession,
    dto: EmojiUpdateDto,
    file: Express.Multer.File,
  ) {
    const { emoji, oldPath } = await this.db
      .withTransaction(session, async (_session) => {
        const emoji = await this.emojiModel
          .findById(dto.id)
          .session(_session)
          .exec();
        if (!emoji) {
          throw new BusinessError('emoji.update.notFound');
        }

        emoji.group = dto.group;
        emoji.key = dto.key;
        emoji.name = emoji.name;
        let oldPath;
        if (!!file) {
          oldPath = emoji.path;
          emoji.url = path.join(
            `/${PATH_EMOJIS}`,
            file.destination.replace(FILE_DIR, ''),
            file.filename,
          );
          emoji.type = file.mimetype;
          emoji.path = file.path;
        }
        await emoji.save({ session: _session });
        return {
          emoji,
          oldPath,
        };
      })
      .catch((e) => {
        if (file) {
          FileUtils.unlinkSyncSilentEnoent(file.path);
        }
        throw e;
      });
    if (oldPath) {
      FileUtils.unlinkSyncSilentEnoent(oldPath);
    }
    return emoji;
  }

  async deleteById(session: CSession, id: string) {
    return this.db.withTransaction(session, async (_session) => {
      const emoji = await this.emojiModel
        .findByIdAndDelete(id, { session: _session })
        .exec();
      FileUtils.unlinkSyncSilentEnoent(emoji.path);
      return emoji;
    });
  }
}
