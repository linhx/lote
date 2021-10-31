<script setup lang="ts">
import Home from './components/Home.vue'
</script>

<template>
  <div class="min-h-full flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
    <div><h2>My note</h2></div>
    <div class="w-full space-y-8 shadow p-3">
      <router-view />
    </div>
  </div>
</template>

<style>
#app {
  font-family: "Segoe UI";
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>
