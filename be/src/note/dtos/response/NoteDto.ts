import { NoteDocument } from 'src/note/entities/Note';

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
  createdAt: Date;
  updatedAt: Date;

  static fromEntity(entity: NoteDocument, content: any) {
    const dto = new NoteDto();
    dto.id = entity.id;
    dto.permalink = entity.permalink;
    dto.title = entity.title;
    dto.banner = entity.banner;
    dto.overview = entity.overview;
    dto.tags = entity.tags;
    dto.category = entity.category;
    dto.images = entity.images;
    dto.content = content;
    dto.isPublished = entity.isPublished;
    dto.isDeleted = entity.isDeleted;
    dto.createdAt = entity.createdAt;
    dto.updatedAt = entity.updatedAt;
    return dto;
  }
}
