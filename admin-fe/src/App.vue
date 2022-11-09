<script setup lang="ts">
import NavBar from './components/NavBar.vue';
import NoteRepository from './repositories/NoteRepository';
import TodayILearnedRepository from './repositories/TodayILearnedRepository';

const republishAllNotes = () => {
  var result = confirm("DANGER: Re-publish all of the notes?");
  if (!result) {
    return;
  }
  // TODO show result
  return NoteRepository.republishAllNotes();
}
const republishAllTils = () => {
  var result = confirm("DANGER: Re-publish all of the today-I-learneds?");
  if (!result) {
    return;
  }
  return TodayILearnedRepository.republishAll();
}
const onClickMenu = (item: string) => {
  if (item === 'republishNotes') {
    return republishAllNotes();
  }
  if (item === 'republishAllTodayILearneds') {
    return republishAllTils();
  }
}
</script>

<template>
  <nav-bar @clickMenu="onClickMenu" />
  <div class="min-h-full flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8">
    <div class="w-full space-y-8 p-3">
      <router-view />
    </div>
  </div>
</template>

<style>
#app {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>
