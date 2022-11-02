<template>
  <div class="w-full md:max-w-3xl mx-auto">
    <div class="font-bold text-3xl">
      <h2 class="text-sky-500 mb-0 text-xl sm:text-2xl md:text-3xl">{{ note?.title }}</h2>
      <hr/>
    </div>
    <div class="text-right text-gray-600 mr-2 text-sm">
      <span>{{ publishedDate }}</span>
    </div>
    <div class="ck ck-editor border-0">
      <div ref="content" class="ck ck-content"></div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import NoteDto from '../../dtos/NoteDto';
import NoteRepository from '../../repositories/NoteRepository';

export default defineComponent({
  props: {
    id: {
      type: String,
      required: true
    }
  },
  data(): {
    note?: NoteDto
  } {
    return {
      note: undefined
    }
  },

  computed: {
    publishedDate() {
      if (this.note?.publishedAt) {
        return new Date(this.note?.publishedAt).toLocaleDateString();
      }
      return '';
    }
  },

  beforeMount() {
    NoteRepository.findById(this.id).then(res => {
      this.note = res;
    });
    NoteRepository.getContentPreview(this.id).then(res => {
      (<HTMLElement>this.$refs.content).innerHTML = res;
    });
  }
})
</script>
