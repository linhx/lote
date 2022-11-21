import PagingDto from '../../../dtos/request/paging.dto';

export default class EmojiFilterListDto extends PagingDto {
  name: string;

  constructor(query: any) {
    super(query);
    this.name = query?.name;
  }
}
