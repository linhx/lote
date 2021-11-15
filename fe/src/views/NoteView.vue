<template>
  <div class="">
    <router-link to="/">
      <img src="../assets/img/icon-home.png" alt="home" class="w-10 m-3 rounded-full border-2"/>
    </router-link>
    <div class="w-full md:max-w-3xl mx-auto pt-10">
      <div class="font-bold text-3xl">
        <h2 class="text-orange-600">{{ note?.title }}</h2>
        <hr/>
      </div>
      <div class="text-right text-gray-600 mr-2 text-sm">
        <span>{{ publishedDate }}</span>
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

  computed: {
    publishedDate() {
      if (this.note?.publishedAt) {
        return new Date(this.note?.publishedAt).toLocaleDateString('vi-VN');
      }
      return '';
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

<style lang="postcss">
.ql-editor p {
  @apply leading-relaxed;
}
.ql-container > .ql-editor ol > li {
  word-break: break-all;
}
</style>