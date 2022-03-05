import { NOTE_PUBLISH_BASE_URL } from 'src/constants';
import HtmlUtils from './HtmlUtils';

export const create = (note: { title: string, tags: string[], publishedAt: Date, permalink: string }, delta: any) => {
  const content = HtmlUtils.deltaToPublishedHtml(delta, note, NOTE_PUBLISH_BASE_URL);
  let tags = '[]';
  if (note.tags && note.tags.length) {
    tags = `['${note.tags.join('\',\'')}']`
  }
  const publishedAt = note.publishedAt.toISOString();
  return `<template>
  <div class="">
    <router-link to="/">
      <img src="../src/assets/img/icon-home.png" alt="home" class="w-10 m-3 rounded-full border-2"/>
    </router-link>
    <div class="w-full md:max-w-3xl mx-auto py-10">
      <div class="font-bold text-3xl">
        <h2 class="text-orange-600">{{ note.title }}</h2>
        <hr/>
      </div>
      <div class="text-right text-gray-600 mr-2 text-sm">
        <span>{{ publishedDate }}</span>
      </div>
      <div class="ql-container ql-snow border-0">
        <div class="ql-editor">
          ${content}
        </div>
      </div>
      <div class="mt-5">
        <span class="font-bold text-xl">Tags </span>
        <span v-for="tag in note.tags" :key="tag" class="text-gray-600 text-sm bg-gray-200 px-1">
          {{ tag }}
        </span>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

declare var hljs: any;

export default defineComponent({
  props: {
    permalink: {
      type: String,
      required: true
    }
  },
  data(): {
    note: any
  } {
    return {
      note: {
        title: '${note.title}',
        tags: ${tags},
        publishedAt: '${publishedAt}'
      }
    }
  },

  computed: {
    publishedDate() {
      if (this.note.publishedAt) {
        return new Date(this.note.publishedAt).toLocaleDateString('vi-VN');
      }
      return '';
    }
  },

  beforeMount() {
    document.querySelectorAll('pre[data-language]').forEach((el) => {
      hljs.highlightElement(el);
    });
  }
})
</script>`;
}
