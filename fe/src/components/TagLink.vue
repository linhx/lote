<script setup lang="ts">
defineProps<{
  tag: string;
}>();
</script>

<template>
  <router-link :to="{ name: 'NotesTagView', params: { tag: tag } }">
    <span class="text-gray-600 text-sm bg-gray-200 px-1 mx-1">
      {{ tag }}
    </span>
  </router-link>
</template>
