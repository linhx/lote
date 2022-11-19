<template>
  <div class="w-full md:max-w-4xl mx-auto">
    <note-item-list
      class="py-3 border-b-1"
      v-for="note in noteList?.items"
      :key="note.id"
      :note="note"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import NoteItemList from './NoteItemList.vue';
import NoteRepository from '../../repositories/NoteRepository';
import PageDto from '../../dtos/PageDto';
import NoteItemListDto from '../../dtos/NoteItemListDto';
import ReqNoteFilterDto from '../../dtos/ReqNoteFilterDto';
import { ActiveLoader } from 'vue-loading-overlay';

export default defineComponent({
  components: {
    NoteItemList,
  },
  data(): {
    noteList: PageDto<NoteItemListDto> | null;
    filter: ReqNoteFilterDto;
  } {
    return {
      noteList: null,
      filter: {
        page: 1,
      },
    };
  },

  methods: {
    showLoading() {
      return this.$loading.show();
    },
    hideLoading(loader: ActiveLoader) {
      loader.hide();
    },
  },

  mounted() {
    const loader = this.showLoading();
    NoteRepository.getList(this.filter).then((res) => {
      this.noteList = res;
    }).finally(() => {
      this.hideLoading(loader);
    });
  },
});
</script>
