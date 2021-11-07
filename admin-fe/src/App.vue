<script setup lang="ts">
import Home from './components/Home.vue'
import AuthRepository from './repositories/AuthRepository';
</script>

<template>
  <div class="min-h-full flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
    <div><h2>My note</h2></div>
    <div class="w-full space-y-8 p-3">
      <router-view />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  async beforeCreate() {
    await AuthRepository.getLoggedInUser().catch(() => {
      window.location.href = import.meta.env.VITE_APP_LOGIN_URL + '?callbackUrl=' + window.location.href;
    });
  }
})
</script>


<style>
#app {
  font-family: "Segoe UI";
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>
