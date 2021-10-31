<template>
  <button class="btn disabled:opacity-50" :class="classes" :disabled="disabled"><slot /></button>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  props: {
    variant: String,
    disabled: Boolean
  },
  computed: {
    classes () {
      let classes = '';
      if (this.variant) {
        classes += `btn-${this.variant} `;
      }
      return classes;
    }
  }
});
</script>
