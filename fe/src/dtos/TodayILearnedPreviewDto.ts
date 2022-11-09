export default interface ReqTodayILearnedFilterDto {
  id: number;
  permalink: string;
  title: string;
  tags: string[];
  category?: number;
  publishedAt: Date;
  publishedVersion: string;
}
