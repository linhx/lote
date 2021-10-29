export default class PagingDto {
  page: number;
  limit: number = 10;

  constructor(query: any) {
    this.page = query?.page;
    this.limit = query?.limit;
  }

  getSkip() {
    return (this.page - 1) * this.limit;
  }
}
