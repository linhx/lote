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
  todayILearnedStore.getContentHTMLByPermalink(todayILearned.permalink);
}
</script>

<template>
  <div class="flex">
    <div class="body text-left space-y-1 w-full">
      <div class="flex items-baseline">
        <span class="text-gray-600 mr-6 text-sm">{{ publishedDate }}</span>
        <router-link
          class="font-semibold text-sky-500 inline-block truncate"
          :title="todayILearned.title"
          :to="{ name: 'TodayILearnedView', params: { permalink: todayILearned.permalink } }"
          @mouseover="prefetchContent"
          @focusin="prefetchContent"
        >{{ todayILearned.title }}</router-link>
      </div>
    </div>
  </div>
</template>
