<template>
  <div class="flex">
    <div class="body pl-5 text-left space-y-1 w-full">
      <div>
        <prefetch-link class="text-lg sm:text-xl md:text-2xl font-semibold text-sky-500 inline-block" :to="'/' + note.permalink">{{ note.title }}</prefetch-link>
      </div>
      <div class="font-light whitespace-pre-wrap w-full">
        <div class="text-sm md:text-base line-clamp-2">{{ note.overview }}</div>
        <div class="mt-2.5">
          <span class="text-gray-600 mr-2 text-sm">{{ publishedDate }}</span>
          <tag-link v-for="tag in note.tags" :key="tag" :tag="tag" />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';
import NotePreviewDto from '../dtos/NotePreviewDto';
import TagLink from './TagLink.vue';

export default defineComponent({
  components: {
    TagLink
  },
  props: {
    note: {
      type: Object as PropType<NotePreviewDto>,
      required: true
    },
  },
  computed: {
    publishedDate() {
      return new Date(this.note.publishedAt).toLocaleDateString('vi-VN');
    }
  }
});
</script>
