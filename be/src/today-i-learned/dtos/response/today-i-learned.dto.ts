import { TodayILearnedDocument } from '../../entities/today-i-learned.entity';

export default class TodayILearnedDto {
  id: string;
  permalink: string;
  title: string;
  tags: string[];
  category: number;
  images: string[];
  content: string;
  isPublished: boolean;
  isDeleted: boolean;
  publishedAt: Date;
  updatePublicationAt: Date;
  createdAt: Date;
  updatedAt: Date;

  static fromEntityWithoutContent(entity: TodayILearnedDocument) {
    const dto = new TodayILearnedDto();
    dto.id = entity.id;
    dto.permalink = entity.permalink;
    dto.title = entity.title;
    dto.tags = entity.tags;
    dto.category = entity.category;
    dto.images = entity.images;
    dto.isPublished = entity.isPublished;
    dto.isDeleted = entity.isDeleted;
    dto.publishedAt = entity.publishedAt;
    dto.updatePublicationAt = entity.updatePublicationAt;
    dto.createdAt = entity.createdAt;
    dto.updatedAt = entity.updatedAt;
    return dto;
  }

  static fromEntity(entity: TodayILearnedDocument) {
    const dto = TodayILearnedDto.fromEntityWithoutContent(entity);
    dto.content = entity.content;
    return dto;
  }
}
