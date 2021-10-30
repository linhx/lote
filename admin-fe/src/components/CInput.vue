<template>
  <input
    type="text"
    :name="name"
    :value="modelValue"
    @change="onChange"
    @input="onInput"
    autocomplete="given-name"
    class="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md" />
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  props: {
    modelValue: String,
    name: String
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
