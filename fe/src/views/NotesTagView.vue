<script setup lang="ts">
import { onBeforeMount, ref } from 'vue';
import { onBeforeRouteUpdate } from 'vue-router';
import NotePreview from '../components/NotePreview.vue';
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
    <div class="font-bold logo-text text-gray-800 dark:text-slate-200" :class="{ loading: isLoading }">
      <h2 class="text-xl sm:text-2xl md:text-3xl my-2">{{ t('tag') }}: {{ tag }}<span class="cursor-blinking">_</span></h2>
    </div>
    <note-preview
      class="py-4 border-b-1 border-slate-200"
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

.cursor-blinking {
animation: ping 1s cubic-bezier(0.79,-0.26, 0.65,-0.13) infinite;
}
</style>