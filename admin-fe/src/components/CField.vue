<template>
  <div class="col-span-6 sm:col-span-3">
    <label class="block text-sm font-medium text-gray-700">{{ label }}</label>
    <slot />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  props: {
    label: String
  },
})
</script>
