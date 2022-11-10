<script setup lang="ts">
import { useNotesStore } from '../stores/notes';
import { PATHS_NAME } from '../constants/paths';
import { useBindContentEvent } from '../hooks/content';
const noteStore = useNotesStore();
const props = defineProps<{
  permalink: string;
  v?: string;
}>();

const { contentRef, contentHTML } = useBindContentEvent(PATHS_NAME.NOTES_TAG, async () => {
  await noteStore.getContentHTMLByPermalink(props.permalink, props.v);
  return noteStore.cacheNotesContentHTML.get(props.permalink) || '';
});
</script>

<template>
  <div ref="contentRef" class="note" v-html="contentHTML">
  </div>
  <div class="note__comment-wrapper">
    <comments-section :permalink="permalink" />
  </div>
</template>
