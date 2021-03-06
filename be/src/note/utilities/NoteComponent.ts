import { NOTE_FE_BASE_URL } from 'src/constants';
import HtmlUtils from './HtmlUtils';

export const create = (
  note: { title: string; tags: string[]; publishedAt: Date; permalink: string },
  delta: any,
) => {
  const content = HtmlUtils.deltaToPublishedHtml(delta, note, NOTE_FE_BASE_URL);
  let tags = '[]';
  if (note.tags && note.tags.length) {
    tags = `['${note.tags.join("','")}']`;
  }
  const publishedAt = note.publishedAt.toISOString();
  return `<template>
  <div class="">
    <router-link to="/" class="icon-top icon-home">
    </router-link>
    <div v-if="displayBtnBack" class="icon-top icon-back" @click="onBack">
    </div>
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
        <tag-link v-for="tag in note.tags" :key="tag" :tag="tag" />
      </div>

      <div class="mt-4">
        <comments-section :permalink="permalink" />
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
    note: any;
    fromRouteName: '';
  } {
    return {
      note: {
        title: '${note.title}',
        tags: ${tags},
        publishedAt: '${publishedAt}'
      },
      fromRouteName: '',
    }
  },

  computed: {
    publishedDate() {
      if (this.note.publishedAt) {
        return new Date(this.note.publishedAt).toLocaleDateString('vi-VN');
      }
      return '';
    },
    displayBtnBack() {
      return this.fromRouteName === 'NotesTagView';
    },
  },

  methods: {
    onBack() {
      this.$router.back();
    }
  },

  mounted() {
    document.querySelectorAll('pre[data-language]').forEach((el) => {
      hljs.highlightElement(el);
    });
  },

  beforeRouteEnter(to, from, next) {
    next((vm: any) => {
      vm.fromRouteName = from.name;
    });
  }
})
</script>`;
};
