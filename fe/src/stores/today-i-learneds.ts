import { defineStore } from 'pinia';
import TodayILearnedPreviewDto from '../dtos/TodayILearnedPreviewDto';
import PageDto from '../dtos/PageDto';
import TodayILearnedRepository from '../repositories/TodayILearnedRepository';

export type TodayILearnedStore = {
  todayILearneds?: PageDto<TodayILearnedPreviewDto>;
  fetched: boolean;
  tagTodayILearneds?: PageDto<TodayILearnedPreviewDto> & { tag?: string };
  cacheTodayILearnedsContentHTML: Map<string, string>;
  cacheTodayILearnedsContentArray: Array<string>;
};

const defaultTodayILearneds = {
  items: [],
  page: 1,
  total: 0
}

export const useTodayILearnedsStore = defineStore('today-i-learneds', {
  state: (): TodayILearnedStore => {
    return {
      todayILearneds: defaultTodayILearneds,
      fetched: false,

      tagTodayILearneds: defaultTodayILearneds,
      cacheTodayILearnedsContentHTML: new Map(),
      cacheTodayILearnedsContentArray: [],
    };
  },
  actions: {
    async getAll() {
      if (this.fetched) {
        return;
      }
      return TodayILearnedRepository.getList({
        page: 1,
        limit: 100,
      }).then((res) => {
        this.todayILearneds = res;
        this.fetched = true;
      });
    },

    async getAllByTag(tag: string) {
      if (this.tagTodayILearneds?.tag === tag) {
        return;
      }
      this.tagTodayILearneds = { ...defaultTodayILearneds };

      return TodayILearnedRepository.getList({
        page: 1,
        limit: 100,
        tag
      }).then((res) => {
        this.tagTodayILearneds = res;
        this.tagTodayILearneds.tag = tag;
      });
    },

    async getContentHTMLByPermalink(permalink: string, v?: string) {
      const contentHTML = this.cacheTodayILearnedsContentHTML.get(permalink);
      if (contentHTML) {
        return contentHTML;
      }

      const newContentHTML = await TodayILearnedRepository.getContentHTMLByPermalink(permalink + '.html?v=' + (v || new Date().getTime()));
      if (this.cacheTodayILearnedsContentArray.length >= 10) {
        const shiftItem = this.cacheTodayILearnedsContentArray.shift();
        if (shiftItem) {
          this.cacheTodayILearnedsContentHTML.delete(shiftItem);
        }
      }
      this.cacheTodayILearnedsContentArray.push(permalink);
      this.cacheTodayILearnedsContentHTML.set(permalink, newContentHTML);
    }
  },
});
