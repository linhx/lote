<script setup lang="ts">
import { ref } from 'vue';

defineProps<{
  sideBarClass: string;
}>();

const emit = defineEmits<{
  (e: 'publishAllNotes'): void;
  (e: 'publishAllTils'): void;
}>();

const publishAllNotes = () => {
  emit('publishAllNotes');
};
const publishAllTils = () => {
  emit('publishAllTils');
};

const isHidden = ref(true);
const close = () => {
  isHidden.value = true;
};
const show = () => {
  isHidden.value = false;
};
</script>

<template>
  <div @click="show" class="fixed left-0 sm:hidden p-3" :class="{ hide: !isHidden }">
    <svg class="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"
      aria-hidden="true">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
    </svg>
  </div>
  <div class="h-screen left-0 top-0 bottom-0 p-2 w-[300px] overflow-y-auto bg-gray-900 fixed sm:relative"
    :class="`${sideBarClass}${isHidden ? ' hide' : ''}`">
    <div class="flex items-center justify-center mt-3">
      <router-link to="/"
        class="py-2.5 flex-1 items-center rounded-md px-4 duration-300 cursor-pointer hover:bg-blue-600 text-white">
        <span class="ml-1 text-gray-200 font-bold">{{ $t('home') }}</span>
      </router-link>
      <span class="btn-close hover:bg-blue-600 rounded-md cursor-pointer flex sm:hidden" @click="close">×</span>
    </div>
    <div class="my-4 bg-gray-600 h-[1px]"></div>
    <router-link :to="{ name: 'NOTES' }"
      class="py-2.5 mt-3 flex items-center rounded-md px-4 duration-300 cursor-pointer hover:bg-blue-600 text-white">
      <span class="ml-1 text-gray-200 font-bold">{{ $t('note') }}</span>
    </router-link>
    <div class="text-left text-sm pl-4 mt-2 mx-auto text-gray-200 font-bold">
      <router-link :to="{ name: 'NOTES' }" class="py-2.5 px-4 hover:bg-blue-600 rounded-md mt-1 block text-white">
        {{ $t('list') }}
      </router-link>
      <router-link :to="{ name: 'NOTE_CREATE' }" class="py-2.5 px-4 hover:bg-blue-600 rounded-md mt-1 block text-white">
        {{ $t('create') }}
      </router-link>
      <div class="cursor-pointer py-2.5 px-4 hover:bg-blue-600 rounded-md mt-1 block" @click="publishAllNotes">
        {{ $t('rePublishAll') }}
      </div>
    </div>
    <div class="my-4 bg-gray-600 h-[1px]"></div>
    <router-link :to="{ name: 'TODAY_I_LEARNEDS' }"
      class="py-2.5 mt-3 flex items-center rounded-md px-4 duration-300 cursor-pointer hover:bg-blue-600 text-white">
      <span class="ml-1 text-gray-200 font-bold">{{
          $t('todayILearned')
      }}</span>
    </router-link>
    <div class="text-left text-sm pl-4 mt-2 mx-auto text-gray-200 font-bold">
      <router-link :to="{ name: 'TODAY_I_LEARNEDS' }"
        class="py-2.5 px-4 hover:bg-blue-600 rounded-md mt-1 block text-white">
        {{ $t('list') }}
      </router-link>
      <router-link :to="{ name: 'TODAY_I_LEARNED_CREATE' }"
        class="py-2.5 px-4 hover:bg-blue-600 rounded-md mt-1 block text-white">
        {{ $t('create') }}
      </router-link>
      <div class="cursor-pointer py-2.5 px-4 hover:bg-blue-600 rounded-md mt-1 block" @click="publishAllTils">
        {{ $t('rePublishAll') }}
      </div>
    </div>
  </div>
</template>

<style scoped>
.btn-close {
  font-family: sans-serif;
  color: white;
  line-height: 0;
  font-size: 24px;
  height: 14px;
  width: 14px;
  align-items: center;
  justify-content: center;
  padding: 1rem;
}

.hide {
  display: none;
}

@media (min-width: 640px) {
  .hide {
    display: block;
  }
}
</style>

<style>
.sidebar .router-link-active {
  @apply bg-blue-600;
}
</style>