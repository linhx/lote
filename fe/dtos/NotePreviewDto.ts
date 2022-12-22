export default interface NotePreviewDto {
  id: number;
  permalink: string;
  title: string;
  overview: string;
  tags: string[];
  category?: number;
  newCommentsCount: number;
  publishedAt: Date;
  publishedVersion?: string;
}
