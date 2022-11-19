import PagingDto from '../../../dtos/request/PagingDto';

export default class TodayILearnedFilterListDto extends PagingDto {
  tag: string;

  constructor(query: any) {
    super(query);
    this.tag = query?.tag;
  }
}
