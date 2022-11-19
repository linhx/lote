import PagingDto from '../../../dtos/request/paging.dto';

export default class NoteFilterListDto extends PagingDto {
  tag: string;

  constructor(query: any) {
    super(query);
    this.tag = query?.tag;
  }
}
