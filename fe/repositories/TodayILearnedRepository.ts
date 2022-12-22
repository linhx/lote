import PageDto from '../dtos/PageDto';
import TodayILearnedPreviewDto from '../dtos/TodayILearnedPreviewDto';
import api from './Api'
import ReqTodayILearnedFilterDto from '../dtos/ReqTodayILearnedFilterDto';
import TodayILearnedDto from '@/dtos/TodayILearnedDto';

const PATH = '/today-i-learned';

export default {
  getList(filter: ReqTodayILearnedFilterDto): Promise<PageDto<TodayILearnedPreviewDto>> {
    return api.get(PATH, {
      params: filter
    });
  },

  getContentHTMLByPermalink(permalink: string): Promise<string> {
    return api.get(`files/publish/today-i-learneds/${permalink}.html`);
  },

  getByPermalink(permalink: string): Promise<TodayILearnedDto> {
    return api.get(`${PATH}/l/${permalink}`);
  }
}
