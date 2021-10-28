export default interface PageDto<T> {
  items: T[],
  page: number,
  total: number,
}
