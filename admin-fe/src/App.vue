<script setup lang="ts">
import NavBar from './components/NavBar.vue';
</script>

<template>
  <nav-bar @clickMenu="onClickMenu" />
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
import NoteRepository from './repositories/NoteRepository';

export default defineComponent({
  data() {
    return {
      show: false
    }
  },
  methods: {
    redeployFe() {
      var result = confirm("DANGER: Re-deploy the whole app?");
      if (!result) {
        return;
      }
      // TODO show result
      return NoteRepository.redeployFe();
    },
    redeployOnlyNotes() {
      var result = confirm("DANGER: Re-deploy all of the notes?");
      if (!result) {
        return;
      }
      // TODO show result
      return NoteRepository.redeployOnlyNotes();
    },
    recreateAndDeployNotes() {
      var result = confirm("DANGER: Re-create and deploy all notes?");
      if (!result) {
        return;
      }
      // TODO show result
      return NoteRepository.recreateAndDeployNotes();
    },
    onClickMenu(item: string) {
      if (item === 'redeploy') {
        return this.redeployFe();
      }
      if (item === 'redeployNotes') {
        return this.redeployOnlyNotes();
      }
      if (item === 'recreateAndDeployNotes') {
        return this.recreateAndDeployNotes();
      }
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
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>
