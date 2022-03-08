<script setup lang="ts">
import { nextTick, onMounted, ref } from '@vue/runtime-core';
import { onBeforeUnmount } from 'vue';
import { RouteLocationRaw } from 'vue-router';
import { removePrefetch, usePrefetch } from '../router/preFetch';

const props = defineProps<{
  to: RouteLocationRaw;
  replace?: boolean;
  custom?: boolean;
  activeClass?: string;
  exactActiveClass?: string;
  ariaCurrentValue?: 'page' | 'step' | 'location' | 'date' | 'time' | 'true' | 'false';
}>();
const labelRef = ref<HTMLLabelElement>();

onMounted(() => {
  nextTick(() => {
    usePrefetch(labelRef.value?.closest('a'));
  });
});

onBeforeUnmount(() => {
  removePrefetch(labelRef.value?.closest('a'));
});
</script>

<template>
  <router-link v-bind="props">
    <span ref="labelRef"><slot></slot></span>
  </router-link>
</template>
