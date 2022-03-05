<template>
  <div class="flex">
    <div class="body pl-5 text-left space-y-1 w-full">
      <div>
        <router-link tag="div" class="text-2xl font-semibold text-orange-600 inline-block" :to="note.permalink">{{ note.title }}</router-link>
      </div>
      <div class="font-light whitespace-pre-wrap w-full">
        <div class="whitespace-nowrap truncate">{{ note.overview }}</div>
        <div class="mt-2.5">
          <span class="text-gray-600 mr-2 text-sm">{{ publishedDate }}</span>
          <span v-for="tag in note.tags" :key="tag" class="text-gray-600 text-sm bg-gray-200 px-1">
            {{ tag }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';
import NotePreviewDto from '../dtos/NotePreviewDto';

export default defineComponent({
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