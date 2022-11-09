import PageDto from '../dtos/PageDto';
import TodayILearnedPreviewDto from '../dtos/TodayILearnedPreviewDto';
import api from './Api'
import ReqTodayILearnedFilterDto from '../dtos/ReqTodayILearnedFilterDto';
import axios from 'axios';

const PATH = '/today-i-learned';

export default {
  getList(filter: ReqTodayILearnedFilterDto): Promise<PageDto<TodayILearnedPreviewDto>> {
    return api.get(PATH, {
      params: filter
    });
  },

  getContentHTMLByPermalink(permalink: string): Promise<string> {
    return axios.get(`${import.meta.env.VITE_APP_TILS_HTML_PATH}/${permalink}`).then(res => res.data as string);
  }
}
