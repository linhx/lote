<script setup lang="ts">
import NavBar from './components/NavBar.vue';
</script>

<template>
  <nav-bar @clickMenu="onClickMenu" />
  <div class="min-h-full flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8">
    <div class="w-full space-y-8 p-3">
      <router-view />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import NoteRepository from './repositories/NoteRepository';

export default defineComponent({
  methods: {
    republishAllNotes() {
      var result = confirm("DANGER: Re-publish all of the notes?");
      if (!result) {
        return;
      }
      // TODO show result
      return NoteRepository.republishAllNotes();
    },
    onClickMenu(item: string) {
      if (item === 'republishNotes') {
        return this.republishAllNotes();
      }
    }
  }
})
</script>


<style>
#app {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>
