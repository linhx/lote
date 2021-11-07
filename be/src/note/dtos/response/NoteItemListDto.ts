import { NoteDocument } from 'src/note/entities/Note';

export default class NoteItemListDto {
  id: string;
  permalink: string;
  title: string;
  overview: string;
  tags: string[];
  category: number;
  createdAt: Date;

  static fromEntity(entity: NoteDocument) {
    const dto = new NoteItemListDto();
    dto.id = entity._id;
    dto.title = entity.title;
    dto.permalink = entity.permalink;
    dto.overview = entity.overview;
    dto.tags = entity.tags;
    dto.category = entity.category;
    dto.createdAt = entity.createdAt;
    return dto;
  }
}
