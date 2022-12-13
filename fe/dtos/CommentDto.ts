export default interface CommentDto {
  id: string;
  parentId: string;
  author: {
    name: string;
    uuid: string;
    role: string;
  };
  content: string;
  postedAt: Date;
}
