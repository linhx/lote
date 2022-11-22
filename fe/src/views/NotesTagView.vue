<script setup lang="ts">
import { onBeforeMount, ref } from 'vue';
import { onBeforeRouteUpdate } from 'vue-router';
import NotePreview from '../components/NotePreview.vue';
import LoadingInline from '../components/LoadingInline.vue';
import { storeToRefs } from 'pinia';
import { useNotesStore } from '../stores/notes';
import * as VueI18n from 'vue-i18n';
const noteStore = useNotesStore();
const { tagNotes } = storeToRefs(noteStore);
const { getAllByTag } = noteStore;
const { t } = VueI18n.useI18n();

const props = defineProps<{
  tag: string;
}>();
const isLoading = ref(true);

onBeforeRouteUpdate((to) => {
  isLoading.value = true;
  getAllByTag(to.params.tag as string).finally(() => {
    isLoading.value = false;
  });
});

onBeforeMount(() => {
  getAllByTag(props.tag).finally(() => {
    isLoading.value = false;
  });
});

</script>

<template>
  <div class="w-full mx-auto">
    <div class="font-bold logo-text text-gray-800 dark:text-slate-200">
      <h2 class="text-xl sm:text-2xl md:text-3xl my-2">{{ t('tag') }}: {{ tag }}<loading-inline :is-loading="isLoading" /></h2>
    </div>
    <note-preview
      class="py-4 border-b-1 border-slate-200 dark:border-slate-700"
      v-for="note in tagNotes?.items"
      :key="note.id"
      :note="note"
    />
  </div>
</template>

<style scoped>
.logo-text {
  font-size: 2rem;
  line-height: 2.25rem;
}
</style>