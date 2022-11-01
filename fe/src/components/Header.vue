<script setup lang="ts">
import * as VueI18n from 'vue-i18n';
import { storeToRefs } from 'pinia';
import { useNotesStore } from '../stores/notes';
import { useStore } from '../stores';
import { computed, onBeforeMount, onUnmounted, ref, watch } from 'vue';
import { useRouter, useRoute } from 'vue-router';
const store = useStore();
const { showButtonBack } = storeToRefs(store);
const noteStore = useNotesStore();
const { fetched } = storeToRefs(noteStore);
defineProps<{
  innerClass?: string;
}>();

const { t } = VueI18n.useI18n();

const route = useRoute();
const router = useRouter();
const back = () => {
  router.back();
};

const isHomePage = computed(() => route.path === "/");

const isTop = ref(true);
const onScroll = () => {
  isTop.value = window.scrollY <= 0;
}

onBeforeMount(() => {
  window.addEventListener('scroll', onScroll);
});
onUnmounted(() => {
  window.removeEventListener('scroll', onScroll);
});
</script>

<template>
  <div class="header-wrapper w-full">
    <div class="header w-full bg-white transition-all box-border z-10 fixed top-0" :class="{ 'fixed-header': !isTop }">
      <div v-if="isHomePage" class="font-bold logo-text text-gray-800 h-full flex items-center" :class="fetched? innerClass : `loading ${innerClass}`">
        <h2 class="title m-0 text-3xl">{{ t('blogName') }}<span class="cursor-blinking">_</span></h2>
      </div>
      <div v-else class="h-full flex items-center" :class="innerClass">
        <router-link to="/" class="lowercase text-lg text-gray-800 hover:underline hover:text-gray-700">
          /{{ t('home') }}
        </router-link>
        <a v-if="showButtonBack" class="inline-block ml-4 cursor-pointer lowercase text-lg text-gray-800 hover:underline hover:text-gray-700" @click="back">
          {{ t('back') }}
        </a>
      </div>
    </div>
  </div>
</template>

<style scoped>
.header-wrapper {
  padding-bottom: var(--header-height);
}
.header {
  height: var(--header-height);
}
.fixed-header {
  box-shadow: 0 2px 5px 0 rgba(16, 15, 15, 0.3);
  height: var(--header-height-small);
}
.title {
  transition: font-size 150ms;
}
.fixed-header .title {
  @apply text-2xl;
}
.cursor-blinking {
  animation: ping 1s cubic-bezier(0.79,-0.26, 0.65,-0.13) infinite;
}
</style>