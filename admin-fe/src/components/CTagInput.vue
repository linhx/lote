<template>
  <div>
    <input
      type="text"
      :name="name"
      v-model="tagValue"
      @keypress.enter="onKeyEnter"
      class="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md mb-1" />
      <c-tag v-for="tag in modelValue" :key="tag + ''" :label="tag + ''" @remove="onRemoveTag" class="mr-1 mb-1" />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import CTag from './CTag.vue';

export default defineComponent({
  components: {
    CTag
  },

  props: {
    modelValue: Array,
    name: String
  },

  data() {
    return {
      tagValue: ''
    }
  },

  methods: {
    onKeyEnter(e: Event) {
      const newTag = (<HTMLInputElement>e.target)?.value.trim().toLowerCase();
      this.tagValue = '';
      if (newTag) {
        const index = this.modelValue? this.modelValue.indexOf(newTag) : -1;
        if (index > -1) {
          return;
        }
        const newValue = this.modelValue? [...this.modelValue, newTag] : [newTag];
        this.$emit('update:modelValue', newValue);
      }
    },
    onRemoveTag(tag: string) {
      const index = this.modelValue? this.modelValue.indexOf(tag) : -1;
      if (index > -1 && this.modelValue) {
        const cloneValue = [...this.modelValue]
        cloneValue.splice(index, 1);
        this.$emit('update:modelValue', cloneValue);
      }
    }
  },
})
</script>
