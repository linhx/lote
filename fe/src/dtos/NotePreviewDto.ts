export default interface NotePreviewDto {
  id: number,
  permalink: string,
  title: string,
  overview: string,
  image: string,
  tags: string[],
  category?: number,
  createdAt: Date,
  updatedAt: Date,
}
