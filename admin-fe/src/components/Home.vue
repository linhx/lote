<template>
  <div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import NotePreview from './NotePreview.vue';
import NoteRepository from '../repositories/NoteRepository';
import PageDto from '../dtos/PageDto';
import NotePreviewDto from '../dtos/NotePreviewDto';

export default defineComponent({
  components: {
    NotePreview
  },
  data (): {
    noteList: PageDto<NotePreviewDto> | null
  } {
    return {
      noteList: null
    }
  },

  mounted() {
    NoteRepository.getList({
      page: 1,
      limit: 100
    }).then(res => {
      this.noteList = res;
    });
  }
})
</script>
