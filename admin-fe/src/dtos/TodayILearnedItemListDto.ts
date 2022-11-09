export default interface TodayILearnedItemListDto {
  id: string;
  permalink: string;
  title: string;
  isPublished: boolean;
  isDeleted: boolean;
  tags: string[];
  category?: number;
  updatePublicationAt: Date;
  createdAt: Date;
  updatedAt: Date;
}
