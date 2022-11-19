import { Note } from '../../entities/note.entity';

export default class PublicNoteItemListDto {
  permalink: string;
  title: string;
  overview: string;
  tags: string[];
  category: number;
  publishedAt: Date;
  publishedVersion: string;

  static fromEntity(entity: Note) {
    const dto = new PublicNoteItemListDto();
    dto.title = entity.title;
    dto.permalink = entity.permalink;
    dto.overview = entity.overview;
    dto.tags = entity.tags;
    dto.category = entity.category;
    dto.publishedAt = entity.publishedAt;
    dto.publishedVersion = entity.publishedVersion;
    return dto;
  }
}
