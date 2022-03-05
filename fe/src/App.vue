<script setup lang="ts">
import { useRoute } from 'vue-router';
import { usePrefetch } from './router/preFetch';
const route = useRoute();

usePrefetch(route);
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
