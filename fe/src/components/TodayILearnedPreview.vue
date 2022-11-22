<script setup lang="ts">
import TodayILearnedPreviewDto from '../dtos/TodayILearnedPreviewDto';
import { computed } from 'vue';
import { useTodayILearnedsStore } from '../stores/today-i-learneds';
const todayILearnedStore = useTodayILearnedsStore();
const {
  todayILearned,
} = defineProps<{
  todayILearned: TodayILearnedPreviewDto,
}>();

const publishedDate = computed(() => new Date(todayILearned.publishedAt).toLocaleDateString('vi-VN'));

const prefetchContent = () => {
  todayILearnedStore.getContentHTMLByPermalink(todayILearned.permalink, todayILearned.publishedVersion);
}
</script>

<template>
  <div class="flex">
    <div class="body text-left space-y-1 w-full">
      <div class="flex flex-col md:flex-row items-baseline">
        <span class="text-gray-600 dark:text-slate-400 mr-5 w-24 text-sm">{{ publishedDate }}</span>
        <router-link
          class="text-sky-500 inline-block text-sm sm:text-base hover:underline"
          :title="todayILearned.title"
          :to="{ name: 'TodayILearnedView', params: { permalink: todayILearned.permalink }, state: { v: todayILearned.publishedVersion } }"
          @mouseover="prefetchContent"
          @focusin="prefetchContent"
        >{{ todayILearned.title }}</router-link>
      </div>
    </div>
  </div>
</template>
