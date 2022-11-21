<script setup lang="ts">
import Header from './components/Header.vue';
</script>

<template>
  <Header class="w-full text-gray-800 dark:text-slate-200" inner-class="md:max-w-3xl mx-auto px-4 md:px-0" />
  <div class="text-gray-800 dark:text-slate-400 px-4 md:px-0 pb-8 md:max-w-3xl mx-auto">
    <router-view />
  </div>
</template>

<style>
body {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>
