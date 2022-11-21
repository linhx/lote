import { NoteDocument } from '../../entities/note.entity';

export default class NoteDto {
  id: string;
  permalink: string;
  title: string;
  banner: string;
  overview: string;
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

  static fromEntityWithoutContent(entity: NoteDocument) {
    const dto = new NoteDto();
    dto.id = entity.id;
    dto.permalink = entity.permalink;
    dto.title = entity.title;
    dto.banner = entity.banner;
    dto.overview = entity.overview;
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

  static fromEntity(entity: NoteDocument) {
    const dto = NoteDto.fromEntityWithoutContent(entity);
    dto.content = entity.content;
    return dto;
  }
}