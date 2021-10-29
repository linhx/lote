import { Note } from 'src/note/entities/Note';

export default class NoteItemListDto {
  permalink: string;
  title: string;
  overview: string;
  tags: string[];
  category: number;
  createdAt: Date;

  static fromEntity(entity: Note) {
    const dto = new NoteItemListDto();
    dto.title = entity.title;
    dto.permalink = entity.permalink;
    dto.overview = entity.overview;
    dto.tags = entity.tags;
    dto.category = entity.category;
    dto.createdAt = entity.createdAt;
    return dto;
  }
}
