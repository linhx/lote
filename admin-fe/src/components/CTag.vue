<template>
  <span class="text-xs inline-flex items-center font-bold leading-sm lowercase pl-2 pr-1 py-1 bg-blue-200 text-blue-700 rounded-full">
    {{ label }}
    <span class="ml-2 cursor-pointer hover:bg-blue-100 bg-gray-100 rounded-full w-4 h-4 text-center select-none" @click="onRemove">✕</span>
  </span>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  props: {
    label: String
  },
  methods: {
    onRemove() {
      this.$emit('remove', this.label);
    }
  }
})
</script>
