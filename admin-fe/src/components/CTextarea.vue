<template>
  <div class="col-span-6 sm:col-span-3">
    <label :for="name" class="block text-sm font-medium text-gray-700">{{ label }}</label>
    <textarea
      type="text"
      :name="name"
      :value="value"
      :rows="rows"
      @change="onChange"
      @input="onInput"
      class="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 mt-1 block w-full sm:text-sm border border-gray-300 rounded-md" />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  props: {
    value: String,
    label: String,
    name: String,
    rows: {
      default: 3,
      type: Number
    },
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
