import { TodayILearnedDocument } from '../../entities/today-i-learned.entity';

export default class PublicTodayILearnedDto {
  permalink: string;
  title: string;
  tags: string[];
  category: number;
  publishedAt: Date;
  updatePublicationAt: Date;

  static fromEntity(entity: TodayILearnedDocument) {
    const dto = new PublicTodayILearnedDto();
    dto.permalink = entity.permalink;
    dto.title = entity.title;
    dto.tags = entity.tags;
    dto.category = entity.category;
    dto.publishedAt = entity.publishedAt;
    dto.updatePublicationAt = entity.updatePublicationAt;
    return dto;
  }
}
