export default class Comment {
  id;
  parentId;
  author;
  content;
  postedAt;

  subs = [];

  constructor(dto) {
    this.id = dto.id;
    this.parentId = dto.parentId;
    this.author = dto.author;
    this.content = dto.content;
    this.postedAt = new Date(dto.postedAt);
  }
}
