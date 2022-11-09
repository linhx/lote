import { TodayILearnedDocument } from '../../entities/today-i-learned.entity';

export default class TodayILearnedItemListDto {
  id: string;
  permalink: string;
  title: string;
  tags: string[];
  category: number;
  isPublished: boolean;
  updatePublicationAt: Date;
  createdAt: Date;
  updatedAt: Date;

  static fromEntity(entity: TodayILearnedDocument) {
    const dto = new TodayILearnedItemListDto();
    dto.id = entity._id;
    dto.title = entity.title;
    dto.permalink = entity.permalink;
    dto.tags = entity.tags;
    dto.category = entity.category;
    dto.isPublished = entity.isPublished;
    dto.updatePublicationAt = entity.updatePublicationAt;
    dto.createdAt = entity.createdAt;
    dto.updatedAt = entity.updatedAt;
    return dto;
  }
}
