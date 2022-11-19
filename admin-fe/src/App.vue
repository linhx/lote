<script setup lang="ts">
import SideBar from './components/SideBar.vue';
import NoteRepository from './repositories/NoteRepository';
import TodayILearnedRepository from './repositories/TodayILearnedRepository';
import * as VueI18n from 'vue-i18n';

const { t } = VueI18n.useI18n();

const republishAllNotes = () => {
  var result = confirm("DANGER: Re-publish all of the notes?");
  if (!result) {
    return;
  }
  return NoteRepository.republishAllNotes().then(() => {
    alert(t('message.succeed'));
  });
}
const republishAllTils = () => {
  var result = confirm("DANGER: Re-publish all of the today-I-learneds?");
  if (!result) {
    return;
  }
  return TodayILearnedRepository.republishAll().then(() => {
    alert(t('message.succeed'));
  });
}
</script>

<template>
  <div class="flex flex-row justify-center min-h-screen">
    <side-bar side-bar-class="sidebar"
      @publishAllNotes="republishAllNotes"
      @publishAllTils="republishAllTils"
    />
    <div class="w-full space-y-8 p-3 mt-6">
      <router-view />
    </div>
  </div>
</template>

<style>
#app {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
.sidebar {
  z-index: 100;
}
</style>
