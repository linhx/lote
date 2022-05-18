<script setup lang="ts">
import { onBeforeMount, ref } from 'vue';
import { onBeforeRouteUpdate } from 'vue-router';
import NotePreview from '../components/NotePreview.vue';
import NoteRepository from '../repositories/NoteRepository';
import { storeToRefs } from 'pinia';
import { useNotesStore } from '../stores/notes';
const noteStore = useNotesStore();
const { tagNotes } = storeToRefs(noteStore);
const { getAllByTag } = noteStore;

const props = defineProps<{
  tag: string;
}>();
const isLoading = ref(true);

onBeforeRouteUpdate((to) => {
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
  <div>
    <router-link to="/" class="icon-top icon-home">
    </router-link>
    <div class="w-full md:max-w-4xl mx-auto pt-10">
      <div class="font-bold logo-text text-gray-800" :class="{ loading: isLoading }">
        <h2 class="">Tag: {{ tag }}<span class="cursor-blinking">_</span></h2>
      </div>
      <note-preview
        class="py-3 border-b-1"
        v-for="note in tagNotes?.items"
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