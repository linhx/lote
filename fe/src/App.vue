<script setup lang="ts">
import { removeObserver } from './router/preFetch';
import Header from './components/Header.vue';

removeObserver();
</script>

<template>
  <Header class="w-full" inner-class="md:max-w-3xl mx-auto px-4 md:px-0" />
  <div class="px-4 md:px-0 pb-8 md:max-w-3xl mx-auto">
    <router-view />
  </div>
</template>

<style>
body {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>
