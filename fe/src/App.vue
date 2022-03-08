<script setup lang="ts">
import { removeObserver } from './router/preFetch';

removeObserver();
</script>

<template>
  <div class="px-2">
    <router-view />
  </div>
</template>

<style>
#app {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>
