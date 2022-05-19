<script setup lang="ts">
defineProps<{
  tag: string;
}>();
</script>

<template>
  <router-link :to="{ name: 'NotesTagView', params: { tag: tag } }" class="">
    <span class="hover:shadow-md rounded-sm transition-colors duration-150 text-gray-600 hover:bg-gray-700 hover:text-white text-sm bg-gray-200 px-1 mx-1">
      {{ tag }}
    </span>
  </router-link>
</template>
