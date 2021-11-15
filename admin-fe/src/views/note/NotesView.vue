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

  mounted() {
    NoteRepository.getList(this.filter).then((res) => {
      this.noteList = res;
    });
  },
});
</script>
