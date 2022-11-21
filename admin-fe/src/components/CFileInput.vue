<template>
  <span
    v-if="hasFile"
    class="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
    style="line-height: 1.25rem; padding: 0.5rem 0.75rem"
  >
    {{ fileName }}
    <span
      class="ml-2 cursor-pointer hover:bg-blue-100 bg-gray-100 rounded-full w-4 h-4 text-center select-none"
      @click="onRemove"
      >✕</span
    >
  </span>
  <input
    v-else
    ref="input"
    type="file"
    :accept="accept"
    aria-label="name"
    :multiple="multiple"
    class="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
  />
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  props: {
    modelValue: File,
    name: String,
    accept: String,
    fileName: String,
    multiple: Boolean,
  },
  data() {
    return {
      hasFile: !!this.fileName,
    };
  },

  methods: {
    onRemove() {
      this.hasFile = false;
    },
    clear() {
      (this.$refs.input as any).value = '';
    }
  },
});
</script>

<style scoped>
input {
  border-width: 1px;
  padding: 0.3rem 0.75rem;
}
</style>
