<script setup lang="ts">
import { ref } from 'vue';
import TextareaWithBtn from './TextareaWithBtn.vue';

const emit = defineEmits<{
  (e: 'post', value: { content: string; }): void,
}>();
const content = ref('');
const nameRef = ref<HTMLElement>();
const onSend = () => {
  emit('post', {
    content: content.value
  });
  content.value = '';
}
</script>

<template>
  <div>
    <textarea-with-btn v-model="content" placeholder="Comment không quá 500 ký tự. (Ctrl + Enter)" :maxlength="500" @post="onSend" />
  </div>
</template>

<style scoped>
.comment-name {
  line-height: 1rem;
}
</style>