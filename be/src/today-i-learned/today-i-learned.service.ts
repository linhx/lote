import { Injectable, Logger } from '@nestjs/common';
import { TodayILearned, TodayILearnedDocument } from './entities/today-i-learned.entity';
import TodayILearnedCreateDto from './dtos/request/today-i-learn-create.dto';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import PageDto from '../dtos/response/page.dto';
import TodayILearnedItemListDto from './dtos/response/today-i-learned-item-list.dto';
import PublicTodayILearnedItemListDto from './dtos/response/public-today-i-learned-item-list.dto';
import TodayILearnedFilterListDto from './dtos/request/today-i-learn-create-filter-list.dto';
import * as path from 'path';
import { CSession, Db } from '../common/db';
import {
  TILS_PUBLISHED_DIR, TZ,
} from '../constants';
import BusinessError from '../exceptions/business.error';
import { FileService } from '../file/file.service';
import * as TodayILearnedContentUtil from '../utilities/content/note-content';
import * as ArrayUtils from '../utilities/ArrayUtils';
import TodayILearnedUpdateDto from './dtos/request/today-i-learn-update.dto';
import * as FileUtils from '../utilities/FileUtils';
import { nanoid } from 'nanoid';
@Injectable()
export class TodayILearnedService {
  private readonly logger = new Logger(TodayILearnedService.name);

  constructor(
    @InjectModel(TodayILearned.name) private todayILearnedModel: Model<TodayILearnedDocument>,
    private readonly db: Db,
    private readonly fileService: FileService,
  ) {}

  async create(session: CSession, dto: TodayILearnedCreateDto) {
    const { images: imagesDto, ...rest } = dto;
    return this.db.withTransaction(session, async (_session) => {
      const existsByPermalink = await this.existsByPermalink(
        _session,
        rest.permalink,
      );
      if (existsByPermalink) {
        throw new BusinessError('error.til.duplicate-permalink');
      }

      const images = [...imagesDto];

      // make images not temporary files
      await this.fileService.permanentFile(_session, images);

      const newTodayILearned = new this.todayILearnedModel({
        ...rest,
        images,
      });
      const til = await newTodayILearned.save({ session: _session });

      await til.save();
      return til;
    });
  }

  async update(session: CSession, id: string, dto: TodayILearnedUpdateDto) {
    return this.db.withTransaction(session, async (_session) => {
      const oldTodayILearned = await this.findById(_session, id);
      if (!oldTodayILearned) {
        throw new BusinessError('error.til.notfound');
      }
      const oldPermalink = oldTodayILearned.permalink;
      if (oldPermalink != dto.permalink) {
        if (await this.existsByPermalink(_session, dto.permalink)) {
          throw new BusinessError('error.til.duplicate-permalink');
        }
      }
      const { images: imagesDto, ...rest } = dto;

      const images = [...imagesDto];

      const diffImages = ArrayUtils.diffBoth(
        oldTodayILearned.images,
        images,
        (oldImgId, newImgId) => oldImgId === newImgId,
      );

      const deleteImages = diffImages.left;
      await this.fileService.deleteFileByIds(_session, deleteImages);

      const newImages = diffImages.right;
      // make images not temporary files
      await this.fileService.permanentFile(_session, newImages);

      oldTodayILearned.title = rest.title;
      oldTodayILearned.permalink = rest.permalink;
      oldTodayILearned.images = images;
      oldTodayILearned.tags = rest.tags;
      oldTodayILearned.category = rest.category;
      oldTodayILearned.content = rest.content;
      oldTodayILearned.updatedAt = new Date();

      const til = await oldTodayILearned.save({ session: _session });
      if (til.permalink != oldPermalink) {
        this.deleteTodayILearnedHTMLInPublishedDir({ permalink: oldPermalink });
      }
      return til;
    });
  }

  async publishById(session: CSession, id: string) {
    return this.db.withTransaction(session, async (_session) => {
      const til = await this.findById(_session, id);
      return this.publish(_session, til);
    });
  }

  /**
   * TODO avoid duplicated code
   *
   * @param til
   */
  saveTodayILearnedHTMLToPublishedDir(til: TodayILearnedDocument) {
    const tilComponentName = `${til.permalink}.html`;
    const file = path.join(TILS_PUBLISHED_DIR, tilComponentName);
    FileUtils.unlinkSyncSilentEnoent(file);
    const tilContentHTML = TodayILearnedContentUtil.create(til, TZ);
    FileUtils.writeFileSync(file, tilContentHTML, { recursive: true });
  }

  /**
   * create Vue component file to the frontend project.
   */
  async publish(session: CSession, til: TodayILearnedDocument) {
    return this.db.withTransaction(session, async (_session) => {
      if (til.isDeleted) {
        throw new BusinessError('error.publish.wasDeleted');
      }
      if (!til.publishedAt) {
        til.publishedAt = new Date();
      }
      // save til HTML to published dir
      this.saveTodayILearnedHTMLToPublishedDir(til);

      til.isPublished = true;
      til.updatePublicationAt = new Date();
      til.publishedVersion = nanoid(6);
      await til.save();
      return til;
    })
    .catch((e: Error) => {
      this.logger.error('error.til.publish.cantDeploy', e.message);
      throw e;
    });
  }

  republishAll(session: CSession) {
    return this.db.withTransaction(session, async (_session) => {
      const tils = await this.getAllPublishedListModel(_session);
      const recreate = tils.map((til) =>
        this.publish(_session, til)
      );
      await Promise.all(recreate);
    });
  }

  deleteTodayILearnedHTMLInPublishedDir(til: Pick<TodayILearnedDocument, 'permalink'>) {
    // remove til HTML
    const file = path.join(TILS_PUBLISHED_DIR, `${til.permalink}.html`);
    FileUtils.unlinkSyncSilentEnoent(file);
  }

  async unpublishById(session: CSession, id: string) {
    return this.db.withTransaction(session, async (_session) => {
      const til = await this.findById(_session, id);
      if (!til) {
        throw new Error('error.til.unpublish.notfound');
      }

      this.deleteTodayILearnedHTMLInPublishedDir(til);
      til.isPublished = false;
      await til.save({ session: _session });
      return til;
    })
    .catch((e: Error) => {
      this.logger.error('error.unpublish.cantDeleteTodayILearned', e.message);
      throw e;
    });
  }

  async findById(session: CSession, id: string): Promise<TodayILearnedDocument> {
    return this.db.withTransaction(session, (ss) => {
      return this.todayILearnedModel.findById(id).session(ss).exec();
    });
  }

  async findPublishedByPermalink(session: CSession, permalink: string) {
    return this.db.withTransaction(session, (ss) => {
      return this.todayILearnedModel
        .findOne({
          permalink,
          isPublished: true,
          isDeleted: false,
        })
        .session(ss)
        .exec();
    });
  }

  async existsPublishedByPermalink(session: CSession, permalink: string) {
    return this.db.withTransaction(session, (ss) => {
      return this.todayILearnedModel
        .countDocuments({
          permalink,
          isPublished: true,
          isDeleted: false,
        })
        .session(ss)
        .exec();
    });
  }

  async findByPermalink(session: CSession, permalink: string) {
    return this.db.withTransaction(session, (ss) => {
      return this.todayILearnedModel
        .findOne({
          permalink,
        })
        .session(ss)
        .exec();
    });
  }

  existsByPermalink(session: CSession, permalink: string): Promise<boolean> {
    return this.db.withTransaction(session, (ss) => {
      return this.todayILearnedModel
        .countDocuments({
          permalink,
        })
        .session(ss)
        .exec();
    });
  }

  getAllPublishedListModel(session: CSession) {
    return this.db.withTransaction(session, async (ss) => {
      const condition = {
        isPublished: true,
        isDeleted: false,
      };
      return this.todayILearnedModel.find(condition).session(ss).exec();
    });
  }

  async getPublishedList(
    session: CSession,
    dto: TodayILearnedFilterListDto,
  ): Promise<PageDto<PublicTodayILearnedItemListDto>> {
    const condition = {
      isPublished: true,
      isDeleted: false,
    } as {
      isPublished: boolean;
      isDeleted: boolean;
      tags?: string;
    };
    if (dto.tag) {
      condition.tags = dto.tag;
    }

    return this.db.withTransaction(session, async (ss) => {
      const items = await this.todayILearnedModel
        .find(condition)
        .session(ss)
        .sort({ publishedAt: -1 })
        .skip(dto.getSkip())
        .limit(dto.limit)
        .exec()
        .then((results) =>
          results.map((rs) => PublicTodayILearnedItemListDto.fromEntity(rs)),
        );

      const count = await this.todayILearnedModel.count(condition).exec();

      return PageDto.create(items, dto.page, dto.limit, count);
    });
  }

  async findAll(
    session: CSession,
    dto: TodayILearnedFilterListDto,
  ): Promise<PageDto<TodayILearnedItemListDto>> {
    return this.db.withTransaction(session, async (ss) => {
      const items = await this.todayILearnedModel
        .aggregate([
          {
            $project: {
              _id: '$_id',
              title: '$title',
              permalink: '$permalink',
              tags: '$tags',
              category: '$category',
              isPublished: '$isPublished',
              publishedAt: '$publishedAt',
              updatePublicationAt: '$updatePublicationAt',
              isDeleted: '$isDeleted',
              createdAt: '$createdAt',
              updatedAt: '$updatedAt',
            },
          },
        ])
        .session(ss)
        .sort({ createdAt: -1 })
        .skip(dto.getSkip())
        .limit(dto.limit)
        .exec()
        .then((results) => results.map((rs) => TodayILearnedItemListDto.fromEntity(rs)));

      const count = await this.todayILearnedModel.count().exec();

      return PageDto.create(items, dto.page, dto.limit, count);
    });
  }

  async deleteById(session: CSession, id: string) {
    return this.db.withTransaction(session, async (ss) => {
      const til = await this.todayILearnedModel.findByIdAndDelete(id, { session: ss });
      if (!til) {
        throw new Error('error.til.delete.notfound');
      }

      await this.fileService.deleteFileByIds(ss, til.images);

      // delete from `fe` deployed dir
      return this.deleteTodayILearnedHTMLInPublishedDir(til);
    });
  }

  async softDeleteById(session: CSession, id: string) {
    return this.db.withTransaction(session, async (_session) => {
      const til = await this.findById(_session, id);
      if (!til) {
        throw new Error('error.til.delete.notfound');
      }

      // delete from `fe` deployed dir
      this.deleteTodayILearnedHTMLInPublishedDir(til);
      til.isDeleted = true;
      til.isPublished = false;
      await til.save({ session: _session });
      return til;
    });
  }

  async getContentPreview(session: CSession, id: string) {
    return this.db.withTransaction(session, async (ss) => {
      const til = await this.findById(ss, id);
      if (!til) {
        throw new Error('error.til.preview.notfound');
      }

      return TodayILearnedContentUtil.formatContent(til.content);
    });
  }
}
