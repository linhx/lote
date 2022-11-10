<script setup lang="ts">
import { useTodayILearnedsStore } from '../stores/today-i-learneds';
import { PATHS_NAME } from '../constants/paths';
import { useBindContentEvent } from '../hooks/content';
const todayILearnedsStore = useTodayILearnedsStore();
const props = defineProps<{
  permalink: string;
  v?: string;
}>();

const { contentRef, contentHTML } = useBindContentEvent(PATHS_NAME.TODAY_I_LEARNEDS_TAG, async () => {
  await todayILearnedsStore.getContentHTMLByPermalink(props.permalink, props.v);
  return todayILearnedsStore.cacheTodayILearnedsContentHTML.get(props.permalink) || '';
});
</script>

<template>
  <div ref="contentRef" class="note" v-html="contentHTML">
  </div>
</template>
