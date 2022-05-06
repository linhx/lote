import { Comment } from '../entities/Comment';

export default class CommentDto {
  id: string;

  parentId: string;

  author: string;

  content: string;

  postedAt: Date;

  static fromEntity(entity: Comment) {
    const dto = new CommentDto();
    dto.id = entity._id.toString();
    dto.parentId = entity.parent ? entity.parent._id.toString() : null;
    dto.author = entity.author;
    dto.content = entity.content;
    dto.postedAt = entity.postedAt;

    return dto;
  }
}
