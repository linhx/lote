<template>
  <div class="flex rounded-xl">
    <div class="w-20 h-20 flex-shrink-0 overflow-hidden">
      <img class="object-cover h-full" :alt="note.title" :src="note.image" />
    </div>
    <div class="body pl-5 text-left space-y-1">
      <router-link tag="div" class="text-lg font-semibold" :to="'/note/' + note.permalink">{{ note.title }}</router-link>
      <div class="overview text-sm italic font-extralight whitespace-pre-wrap">{{ note.overview }}</div>
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
    }
  }
});
</script>

<style scoped lang="postcss">
.overview {
    @apply overflow-hidden overflow-ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
}
</style>