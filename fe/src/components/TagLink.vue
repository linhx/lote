<script setup lang="ts">
defineProps<{
  tag: string;
}>();
</script>

<template>
  <router-link :to="{ name: 'NotesTagView', params: { tag: tag } }" class="">
    <span class="tag">
      {{ tag }}
    </span>
  </router-link>
</template>
