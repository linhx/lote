import { defineStore } from 'pinia';
import NotePreviewDto from '../dtos/NotePreviewDto';
import PageDto from '../dtos/PageDto';
import NoteRepository from '../repositories/NoteRepository';

export type NoteStore = {
  notes?: PageDto<NotePreviewDto>;
  fetched: boolean;
  tagNotes?: PageDto<NotePreviewDto> & { tag?: string };
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

      tagNotes: defaultNotes
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
    }
  },
});
