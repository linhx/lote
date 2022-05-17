import PagingDto from 'src/dtos/request/PagingDto';

export default class NoteFilterListDto extends PagingDto {
  tag: string;

  constructor(query: any) {
    super(query);
    this.tag = query?.tag;
  }
}
