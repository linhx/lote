<template>
  <div class="flex rounded-xl">
    <div class="w-24 h-24 flex-shrink-0 overflow-hidden">
      <img class="object-cover h-full" :alt="name" :src="image" />
    </div>
    <div class="body pl-5 text-left space-y-1">
      <router-link tag="div" class="text-lg font-semibold" :to="'/note/' + permalink">{{ name }}</router-link>
      <div class="overview text-sm italic font-extralight whitespace-pre-wrap">{{ overview }}</div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  props: {
    id: Number,
    permalink: String,
    image: String,
    name: String,
    overview: String
  }
});
</script>

<style scoped lang="postcss">
.overview {
    @apply overflow-hidden overflow-ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
}
</style>