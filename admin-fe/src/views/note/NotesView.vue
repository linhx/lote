<template>
  <div>
    <note-preview
      class="my-6"
      v-for="note in noteList?.items"
      :key="note.id"
      :note="note"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import NotePreview from './NotePreview.vue';
import NoteRepository from '../../repositories/NoteRepository';
import PageDto from '../../dtos/PageDto';
import NotePreviewDto from '../../dtos/NotePreviewDto';
import ReqNoteFilterDto from '../../dtos/ReqNoteFilterDto';

export default defineComponent({
  components: {
    NotePreview
  },
  data (): {
    noteList: PageDto<NotePreviewDto> | null,
    filter: ReqNoteFilterDto
  } {
    return {
      noteList: null,
      filter: {
        page: 1
      }
    }
  },

  mounted() {
    NoteRepository.getList(this.filter).then(res => {
      this.noteList = res;
    });
  }
})
</script>
