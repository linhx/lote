export default interface NoteItemListDto {
  id: string;
  permalink: string;
  title: string;
  overview: string;
  image: string;
  isPublished: boolean;
  isDeleted: boolean;
  tags: string[];
  category?: number;
  updatePublicationAt: Date;
  createdAt: Date;
  updatedAt: Date;
}
