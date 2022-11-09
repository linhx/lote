<script setup lang="ts">
import { onBeforeMount, ref } from 'vue';
import { onBeforeRouteUpdate } from 'vue-router';
import TodayILearnedPreview from '../components/TodayILearnedPreview.vue';
import { storeToRefs } from 'pinia';
import { useTodayILearnedsStore } from '../stores/today-i-learneds';
import * as VueI18n from 'vue-i18n';
const todayILearnedsStore = useTodayILearnedsStore();
const { tagTodayILearneds } = storeToRefs(todayILearnedsStore);
const { getAllByTag } = todayILearnedsStore;
const { t } = VueI18n.useI18n();

const props = defineProps<{
  tag: string;
}>();
const isLoading = ref(true);

onBeforeRouteUpdate((to) => {
  isLoading.value = true;
  getAllByTag(to.params.tag as string).finally(() => {
    isLoading.value = false;
  });
});

onBeforeMount(() => {
  getAllByTag(props.tag).finally(() => {
    isLoading.value = false;
  });
});

</script>

<template>
  <div class="w-full mx-auto">
    <div class="font-bold logo-text text-gray-800" :class="{ loading: isLoading }">
      <h2 class="text-xl sm:text-2xl md:text-3xl my-2">{{ t('tag') }}: {{ tag }}<span class="cursor-blinking">_</span></h2>
    </div>
    <today-i-learned-preview
      class="py-4 border-b-1 border-slate-200"
      v-for="todayILearned in tagTodayILearneds?.items"
      :key="todayILearned.id"
      :today-i-learned="todayILearned"
    />
  </div>
</template>

<style scoped>
.logo-text {
  font-size: 2rem;
  line-height: 2.25rem;
}

.cursor-blinking {
animation: ping 1s cubic-bezier(0.79,-0.26, 0.65,-0.13) infinite;
}
</style>