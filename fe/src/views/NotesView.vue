<script setup lang="ts">
import { onBeforeMount } from 'vue';
import NotePreview from '../components/NotePreview.vue';
import { storeToRefs } from 'pinia';
import { useNotesStore } from '../stores/notes';
import * as VueI18n from 'vue-i18n';
const noteStore = useNotesStore();
const { notes } = storeToRefs(noteStore);
const { getAll } = noteStore;
const { t } = VueI18n.useI18n();

onBeforeMount(() => {
  getAll();
});

</script>

<template>
  <div>
    <div class="w-full md:max-w-3xl mx-auto">
      <note-preview
        class="py-4 border-b-1 border-slate-200"
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
</style>