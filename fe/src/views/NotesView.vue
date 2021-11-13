<template>
  <div>
    <div v-show="isNotesView" class="w-full md:max-w-4xl mx-auto pt-10">
      <div class="font-bold text-2xl">
        <h2>Linhx's Notes</h2>
      </div>
      <note-preview
        class="py-3 border-b-1"
        v-for="note in noteList?.items"
        :key="note.id"
        :note="note"
      />
    </div>
    <router-view />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import NotePreview from '../components/NotePreview.vue';
import NoteRepository from '../repositories/NoteRepository';
import PageDto from '../dtos/PageDto';
import NotePreviewDto from '../dtos/NotePreviewDto';
import ReqNoteFilterDto from '../dtos/ReqNoteFilterDto';

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
  computed: {
    isNotesView() {
      return this.$route.name === 'NotesView'
    }
  },

  mounted() {
    NoteRepository.getList(this.filter).then(res => {
      this.noteList = res;
    });
  }
})
</script>
