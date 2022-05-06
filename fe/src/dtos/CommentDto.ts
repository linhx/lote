export default interface CommentDto {
  id: string;
  parentId: string;
  author: string;
  content: string;
  postedAt: Date;
}
