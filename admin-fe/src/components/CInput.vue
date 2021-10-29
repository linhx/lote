<template>
  <div class="col-span-6 sm:col-span-3">
    <label :for="name" class="block text-sm font-medium text-gray-700">{{ label }}</label>
    <input
      type="text"
      :name="name"
      :value="value"
      @change="onChange"
      @input="onInput"
      autocomplete="given-name"
      class="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md" />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  props: {
    value: String,
    label: String,
    name: String
  },

  methods: {
    onChange(e: Event) {
      this.$emit('change', (<HTMLInputElement>e.target)?.value);
    },
    onInput(e: Event) {
      this.$emit('input', (<HTMLInputElement>e.target)?.value);
    }
  },
})
</script>
