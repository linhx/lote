<script setup lang="ts">
import TagLink from './TagLink.vue';
import NotePreviewDto from '../dtos/NotePreviewDto';
import { computed } from 'vue';
import { useNotesStore } from '../stores/notes';
const noteStore = useNotesStore();
const {
  note,
} = defineProps<{
  note: NotePreviewDto,
}>();

const publishedDate = computed(() => new Date(note.publishedAt).toLocaleDateString('vi-VN'));

const prefetchNoteContent = () => {
  noteStore.getContentHTMLByPermalink(note.permalink, note.publishedVersion);
}
</script>

<template>
  <div class="flex">
    <div class="body pl-5 text-left space-y-1 w-full">
      <div>
        <router-link
          class="text-lg sm:text-xl md:text-2xl font-semibold text-sky-500 inline-block"
          :to="{ name: 'NoteView', params: { permalink: note.permalink }, state: { v: note.publishedVersion } }"
          @mouseover="prefetchNoteContent"
          @focusin="prefetchNoteContent"
        >{{ note.title }}</router-link>
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
