<script setup lang="ts">
import { onBeforeMount } from 'vue';
import TodayILearnedPreview from '../components/TodayILearnedPreview.vue';
import { storeToRefs } from 'pinia';
import { useTodayILearnedsStore } from '../stores/today-i-learneds';
import * as VueI18n from 'vue-i18n';
const todayILearnedsStore = useTodayILearnedsStore();
const { todayILearneds } = storeToRefs(todayILearnedsStore);
const { getAll } = todayILearnedsStore;

const { t } = VueI18n.useI18n();

onBeforeMount(() => {
  getAll();
});
</script>

<template>
  <div class="w-full md:max-w-3xl mx-auto">
    <div>
      <h2>{{ t('todayILearned') }}</h2>
    </div>
    <today-i-learned-preview
      class="py-2"
      v-for="todayILearned in todayILearneds?.items"
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
</style>