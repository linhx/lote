import { TodayILearned } from '../../entities/today-i-learned.entity';

export default class PublicTodayILearnedItemListDto {
  permalink: string;
  title: string;
  tags: string[];
  category: number;
  publishedAt: Date;
  updatePublicationAt: Date;

  static fromEntity(entity: TodayILearned) {
    const dto = new PublicTodayILearnedItemListDto();
    dto.title = entity.title;
    dto.permalink = entity.permalink;
    dto.tags = entity.tags;
    dto.category = entity.category;
    dto.publishedAt = entity.publishedAt;
    dto.updatePublicationAt = entity.updatePublicationAt;
    return dto;
  }
}
