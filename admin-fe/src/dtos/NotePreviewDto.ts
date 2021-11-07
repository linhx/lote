export default interface NotePreviewDto {
  id: string,
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
