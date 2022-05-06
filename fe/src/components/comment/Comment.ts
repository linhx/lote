import CommentDto from '../../dtos/CommentDto';

export default class Comment {
  id: string;
  parentId: string;
  author: string;
  content: string;
  postedAt: Date;

  subs: Comment[] = [];
  
  constructor(dto: CommentDto) {
    this.id = dto.id;
    this.parentId = dto.parentId;
    this.author = dto.author;
    this.content = dto.content;
    this.postedAt = new Date(dto.postedAt);
  }
}
