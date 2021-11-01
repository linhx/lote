export default interface NotePreviewDto {
  id: number,
  permalink: string,
  title: string,
  overview: string,
  image: string,
  isPublished: boolean,
  isDeleted: boolean,
  tags: string[],
  category?: number,
  createdAt: Date,
  updatedAt: Date,
}
