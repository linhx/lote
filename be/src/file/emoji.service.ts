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
import EmojiFilterListDto from './dtos/request/emoji-filter-list.dto';

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
          category: dto.category,
          name: dto.name,
          key: dto.key,
          url: path.join(
            FILE_URL_PREFIX,
            file.path.replace(FILE_DIR, ''),
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

  async findAllPaging(dto: EmojiFilterListDto) {
    const items = await this.emojiModel.find({
      ...(!!dto.name && { name: dto.name })
    })
    .sort({ name: 1 })
    .skip(dto.getSkip())
    .limit(dto.limit)
    .exec();

    const total = await this.emojiModel.countDocuments({
      ...(!!dto.name && { name: dto.name })
    });

    return {
      items,
      total
    }
  }
  
  findAll() {
    return this.emojiModel.find().sort({ name: 1 });
  }

  findById(session: CSession, id: string) {
    return this.emojiModel.findById(id);
  }

  async update(
    session: CSession,
    dto: EmojiUpdateDto,
    file: Express.Multer.File,
  ) {
    return this.db
      .withTransaction(session, async (_session) => {
        const emoji = await this.emojiModel
          .findById(dto.id)
          .session(_session)
          .exec();
        if (!emoji) {
          throw new BusinessError('emoji.update.notFound');
        }

        emoji.group = dto.group;
        emoji.category = dto.category;
        emoji.key = dto.key;
        emoji.name = emoji.name;
        if (!!file) {
          emoji.url = path.join(
            FILE_URL_PREFIX,
            file.path.replace(FILE_DIR, ''),
          );
          emoji.type = file.mimetype;
          emoji.path = file.path;
        }
        return emoji.save({ session: _session });
      })
      .catch((e) => {
        if (file) {
          FileUtils.unlinkSyncSilentEnoent(file.path);
        }
        throw e;
      });
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

  async import(session: CSession, emojis: EmojiCreateDto[], files: Array<Express.Multer.File>) {
    const _files = files.map(f => f.path);
    return this.db.withTransaction(session, async (_session) => {
      const emojiModels = []
      for(let i = 0; i < emojis.length; i++) {
        const dto = emojis[i];
        const file = files[i];
        const newDest = path.join(FILE_DIR, PATH_EMOJIS, FileUtils.createValidPath(dto.key));
        FileUtils.mkdirSyncIfNotExist(newDest, { recursive: true });
        const newPath = path.join(newDest, file.filename);
        FileUtils.mvSync(file.path, newPath); // move file to under file-dir/emojis/<key>/filename
        _files[i] = newPath;
        const emojiModel = new this.emojiModel({
          group: dto.group,
          groupName: dto.groupName,
          category: dto.category,
          name: dto.name,
          key: dto.key,
          url: path.join(
            FILE_URL_PREFIX,
            newPath.replace(FILE_DIR, ''),
          ),
          type: file.mimetype,
          path: file.path,
        });
        emojiModels.push(emojiModel);
      }

      return this.emojiModel.bulkSave(emojiModels, { session: _session });
    }).catch(e => {
      _files.forEach(file => {
        FileUtils.unlinkSyncSilentEnoent(file);
      });
      throw e;
    });
  }
}
