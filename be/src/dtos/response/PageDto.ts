export default class PageDto<T> {
  items: T[];
  page: number;
  total: number;
  limit: number;

  static create<T>(items: T[], page: number, limit: number, total: number) {
    const dto = new PageDto<T>();
    dto.items = items;
    dto.page = page;
    dto.limit = limit;
    dto.total = total;
    return dto;
  }
}
