import { defineStore } from 'pinia';
import NotePreviewDto from '../dtos/NotePreviewDto';
import PageDto from '../dtos/PageDto';
import NoteRepository from '../repositories/NoteRepository';

export type NoteStore = {
  notes?: PageDto<NotePreviewDto>;
  fetched: boolean;
  tagNotes?: PageDto<NotePreviewDto> & { tag?: string };
};

export const useNotesStore = defineStore('notes', {
  state: (): NoteStore => {
    return {
      notes: {
        items: [],
        page: 1,
        total: 0
      },
      fetched: false,

      tagNotes: {
        items: [],
        page: 1,
        total: 0
      }
    };
  },
  actions: {
    async getAllNotes() {
      if (this.fetched) {
        return;
      }
      NoteRepository.getList({
        page: 1,
        limit: 100,
      }).then((res) => {
        this.notes = res;
        this.fetched = true;
      });
    },

    async getAllByTags(tag: string) {
      if (this.tagNotes?.tag === tag) {
        return;
      }

      NoteRepository.getList({
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
