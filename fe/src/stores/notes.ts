import { defineStore } from 'pinia';
import NotePreviewDto from '../dtos/NotePreviewDto';
import PageDto from '../dtos/PageDto';
import NoteRepository from '../repositories/NoteRepository';

export type NoteStore = {
  notes?: PageDto<NotePreviewDto>;
  fetched: boolean;
  tagNotes?: PageDto<NotePreviewDto> & { tag?: string };
  cacheNotesContentHTML: Map<string, string>;
  cacheNotesContentArray: Array<string>;
};

const defaultNotes = {
  items: [],
  page: 1,
  total: 0
}

export const useNotesStore = defineStore('notes', {
  state: (): NoteStore => {
    return {
      notes: defaultNotes,
      fetched: false,

      tagNotes: defaultNotes,
      cacheNotesContentHTML: new Map(),
      cacheNotesContentArray: [],
    };
  },
  actions: {
    async getAll() {
      if (this.fetched) {
        return;
      }
      return NoteRepository.getList({
        page: 1,
        limit: 100,
      }).then((res) => {
        this.notes = res;
        this.fetched = true;
      });
    },

    async getAllByTag(tag: string) {
      if (this.tagNotes?.tag === tag) {
        return;
      }
      this.tagNotes = { ...defaultNotes };

      return NoteRepository.getList({
        page: 1,
        limit: 100,
        tag
      }).then((res) => {
        this.tagNotes = res;
        this.tagNotes.tag = tag;
      });
    },

    async getContentHTMLByPermalink(permalink: string) {
      const contentHTML = this.cacheNotesContentHTML.get(permalink);
      if (contentHTML) {
        return contentHTML;
      }

      const newContentHTML = await NoteRepository.getContentHTMLByPermalink(permalink + '.html');
      if (this.cacheNotesContentArray.length >= 10) {
        const shiftItem = this.cacheNotesContentArray.shift();
        if (shiftItem) {
          this.cacheNotesContentHTML.delete(shiftItem);
        }
      }
      this.cacheNotesContentArray.push(permalink);
      this.cacheNotesContentHTML.set(permalink, newContentHTML);
    }
  },
});
