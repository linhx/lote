<script setup lang="ts">
import { onBeforeMount, ref } from 'vue'
import NotePreview from '../components/NotePreview.vue';
import NoteRepository from '../repositories/NoteRepository';
import { storeToRefs } from 'pinia';
import { useNotesStore } from '../stores/notes';
import * as VueI18n from 'vue-i18n';
const noteStore = useNotesStore();
const { notes, fetched } = storeToRefs(noteStore);
const { getAll } = noteStore;
const { t } = VueI18n.useI18n();

onBeforeMount(() => {
  getAll();
});

</script>

<template>
  <div>
    <div class="w-full md:max-w-4xl mx-auto pt-10">
      <div class="font-bold logo-text text-gray-800" :class="{ loading: !fetched }">
        <h2>{{ t('blogName') }}<span class="cursor-blinking">_</span></h2>
      </div>
      <note-preview
        class="py-3 border-b-1"
        v-for="note in notes?.items"
        :key="note.id"
        :note="note"
      />
    </div>
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