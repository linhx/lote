import { IsNotEmpty } from 'class-validator';

export default class PagingDto {
  @IsNotEmpty()
  page: number;

  limit: number = 10;

  constructor(query: any) {
    this.page = query?.page;
    this.limit = query?.limit || 10;
  }

  getSkip() {
    return (this.page - 1) * this.limit;
  }
}
