import PageDto from '../dtos/PageDto';
import TodayILearnedItemListDto from '../dtos/TodayILearnedItemListDto';
import api from './Api'
import TodayILearnedCreateDto from '../dtos/TodayILearnedCreateDto';
import ReqTodayILearnedFilterDto from '../dtos/ReqTodayILearnedFilterDto';
import TodayILearnedDto from '../dtos/TodayILearnedDto';
import TodayILearnedUpdateDto from '../dtos/TodayILearnedUpdateDto';

const PATH = 'today-i-learned';

export default {
  getList(filter: ReqTodayILearnedFilterDto): Promise<PageDto<TodayILearnedItemListDto>> {
    return api.get(`${PATH}/all`, { params: filter });
  },
  create(dto: TodayILearnedCreateDto): Promise<TodayILearnedDto> {
    return api.post(PATH, dto);
  },
  findById(id: string): Promise<TodayILearnedDto> {
    return api.get(`${PATH}/${id}`);
  },
  update(id: string, dto: TodayILearnedUpdateDto) {
    return api.post(`${PATH}/${id}`, dto);
  },
  publish(id: string) {
    return api.post(`${PATH}/publish/${id}`);
  },
  unpublish(id: string) {
    return api.post(`${PATH}/unpublish/${id}`);
  },
  softDelete(id: string) {
    return api.delete(`${PATH}/${id}`);
  },
  delete(id: string) {
    return api.delete(`${PATH}/h/${id}`);
  },
  getContentPreview(id: string): Promise<{ content: string; tableOfContents: string }> {
    return api.get(`${PATH}/${id}/preview`);
  },
  republishAll() {
    return api.post(`${PATH}/republish-all`);
  },
}
