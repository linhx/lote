export default interface NoteDto {
  id: string;
  permalink: string;
  title: string;
  banner?: string;
  bannerUrl?: string;
  overview: string;
  content: string;
  tags: string[];
  category: number;
  publishedAt?: Date;
}
