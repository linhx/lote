<script setup lang="ts">
import Home from './components/Home.vue';
import NavBar from './components/NavBar.vue';
</script>

<template>
  <nav-bar />
  <div v-if="show" class="min-h-full flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8">
    <div class="w-full space-y-8 p-3">
      <router-view />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { refreshToken } from './repositories/Api';
import AuthRepository from './repositories/AuthRepository';

export default defineComponent({
  data() {
    return {
      show: false
    }
  },
  async beforeCreate() {
    await AuthRepository.getLoggedInUser()
    .then(() => {
      this.show = true;
    })
    .catch(async ({ response }) => {
      if (response.status === 401) {
        const refreshSuccess = await refreshToken().catch(() => false);
        if (!refreshSuccess) {
          window.location.href = import.meta.env.VITE_APP_LOGIN_URL + '?callbackUrl=' + window.location.href;
        }
        this.show = true;
      } else {
        alert('Có lỗi khi kiểm tra đăng nhập.');
      }
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
