<template>
  <div class="">
    <router-link to="/">
      <img src="../assets/img/icon-home.png" alt="home" class="w-10 m-3 rounded-full border-2"/>
    </router-link>
    <div class="w-full md:max-w-4xl mx-auto pt-10">
      <div class="font-bold text-2xl">
        <h2>{{ note?.title }}</h2>
        <hr/>
      </div>
      <div class="ql-container ql-snow border-0">
        <div ref="content" class="ql-editor"></div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import NoteDto from '../dtos/NoteDto';
import NoteRepository from '../repositories/NoteRepository';

declare var hljs: any

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
      document.querySelectorAll('pre[data-language]').forEach((el) => {
        hljs.highlightElement(el);
      });
    });
  }
})
</script>
