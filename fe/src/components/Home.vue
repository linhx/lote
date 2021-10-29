<template>
  <div>
    <div>
      <h3>My note</h3>
    </div>
    <router-view />
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
    NoteRepository.getList().then(res => {
      this.noteList = res;
    });
  }
})
</script>
