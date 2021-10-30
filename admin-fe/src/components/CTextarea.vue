<template>
  <textarea
    type="text"
    :name="name"
    :value="modelValue"
    :rows="rows"
    @change="onChange"
    @input="onInput"
    class="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 mt-1 block w-full sm:text-sm border border-gray-300 rounded-md" />
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  props: {
    modelValue: String,
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
      this.$emit('update:modelValue', (<HTMLInputElement>e.target)?.value);
    }
  },
})
</script>
