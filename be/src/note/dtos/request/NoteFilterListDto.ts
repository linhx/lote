import PagingDto from 'src/dtos/request/PagingDto';

export default class NoteFilterListDto extends PagingDto {
  constructor(query: any) {
    super(query);
  }
}
