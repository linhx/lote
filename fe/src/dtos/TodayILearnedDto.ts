export default interface TodayILearnedDto {
  id: number;
  permalink: string;
  title: string;
  tags: string[];
  publishedAt: Date;
  updatePublicationAt: Date;
}
