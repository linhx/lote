import { NoteDocument } from '../../entities/note.entity';

export default class NoteItemListDto {
  id: string;
  permalink: string;
  title: string;
  overview: string;
  tags: string[];
  category: number;
  newCommentsCount: number;
  isPublished: boolean;
  updatePublicationAt: Date;
  createdAt: Date;
  updatedAt: Date;

  static fromEntity(entity: NoteDocument & { newCommentsCount: number }) {
    const dto = new NoteItemListDto();
    dto.id = entity._id;
    dto.title = entity.title;
    dto.permalink = entity.permalink;
    dto.overview = entity.overview;
    dto.tags = entity.tags;
    dto.category = entity.category;
    dto.newCommentsCount = entity.newCommentsCount;
    dto.isPublished = entity.isPublished;
    dto.updatePublicationAt = entity.updatePublicationAt;
    dto.createdAt = entity.createdAt;
    dto.updatedAt = entity.updatedAt;
    return dto;
  }
}
