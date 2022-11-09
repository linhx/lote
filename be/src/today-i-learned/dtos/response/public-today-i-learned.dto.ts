import { TodayILearnedDocument } from '../../entities/today-i-learned.entity';

export default class PublicTodayILearnedDto {
  permalink: string;
  title: string;
  tags: string[];
  category: number;
  publishedAt: Date;
  publishedVersion: string;

  static fromEntity(entity: TodayILearnedDocument) {
    const dto = new PublicTodayILearnedDto();
    dto.permalink = entity.permalink;
    dto.title = entity.title;
    dto.tags = entity.tags;
    dto.category = entity.category;
    dto.publishedAt = entity.publishedAt;
    dto.publishedVersion = entity.publishedVersion;
    return dto;
  }
}
