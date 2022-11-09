export default interface TodayILearnedDto {
  id: string;
  permalink: string;
  title: string;
  content: string;
  tags: string[];
  category: number;
  publishedAt?: Date;
}
