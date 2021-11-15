export default interface NoteDto {
  id: number;
  permalink: string;
  title: string;
  tags: string[];
  publishedAt: Date;
  updatePublicationAt: Date;
}
