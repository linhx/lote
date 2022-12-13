import ReqPagingDto from './ReqPagingDto';

export default interface ReqNoteFilterDto extends ReqPagingDto {
  tag?: string;
}