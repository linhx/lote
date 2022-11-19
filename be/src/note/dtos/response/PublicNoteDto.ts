import { NoteDocument } from '../../entities/note.entity';

export default class PublicNoteDto {
  permalink: string;
  title: string;
  banner: string;
  overview: string;
  tags: string[];
  category: number;
  publishedAt: Date;
  updatePublicationAt: Date;

  static fromEntity(entity: NoteDocument) {
    const dto = new PublicNoteDto();
    dto.permalink = entity.permalink;
    dto.title = entity.title;
    dto.banner = entity.banner;
    dto.overview = entity.overview;
    dto.tags = entity.tags;
    dto.category = entity.category;
    dto.publishedAt = entity.publishedAt;
    dto.updatePublicationAt = entity.updatePublicationAt;
    return dto;
  }
}
