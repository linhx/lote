<script setup lang="ts">
import { nextTick, ref } from 'vue';
import TextareaWithBtn from './TextareaWithBtn.vue';

const emit = defineEmits<{
  (e: 'post', value: { author: string, content: string }): void,
}>();
const content = ref('');
const author = ref('');
const nameRef = ref<HTMLElement>();
const onSend = () => {
  nextTick(() => {
    nameRef.value?.focus();
  });
}
const onEnterName = (e: KeyboardEvent) => {
  if (e.key === 'Enter') {
    emit('post', {
      author: author.value,
      content: content.value
    });
    content.value = '';
    author.value = '';
  }
}
</script>

<template>
  <div>
    <textarea-with-btn v-model="content" placeholder="Comment không quá 500 ký tự. (Ctrl + Enter)" :maxlength="500" @post="onSend" />
    <input type="text"
      ref="nameRef"
      v-model="author"
      placeholder="Tên của bạn (default: Anonymous)"
      class="c-input comment-name"
      maxlength="30"
      @keydown="onEnterName">
  </div>
</template>

<style scoped>
.comment-name {
  line-height: 1rem;
}
</style>