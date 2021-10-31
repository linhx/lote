<template>
  <div>
    <h3>{{ note?.title }}</h3>
    <div ref="content"></div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import NoteDto from '../dtos/NoteDto';
import NoteRepository from '../repositories/NoteRepository';

export default defineComponent({
  props: {
    permalink: {
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

  beforeMount() {
    NoteRepository.getByPermalink(this.permalink).then(res => {
      this.note = res;
    });

    NoteRepository.getContent(this.permalink).then(res => {
      (<HTMLElement>this.$refs.content).innerHTML = res;
    });
  }
})
</script>
