<template>
  <div class="mt-10 sm:mt-0">
    <div class="md:grid md:grid-cols-3 md:gap-6">
      <div class="mt-5 md:mt-0 md:col-span-2">
        <c-input v-model="title" label="Title" name="title" />
      </div>
      <div class="mt-5 md:mt-0 md:col-span-1">
        <c-input v-model="permalink" label="Permalink" name="permalink" />
      </div>
      <div class="mt-5 md:mt-0 md:col-span-3">
        <c-textarea v-model="overview" label="Overview" name="overview" />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import CInput from '../../components/CInput.vue';
import CTextarea from '../../components/CTextarea.vue';

export default defineComponent({
  components: {
    CInput,
    CTextarea,
  },
  data () {
    return {
      title: '',
      permalink: '',
      overview: '',
      content: '',
      tags: '',
      category: '',
    }
  }
});
</script>
