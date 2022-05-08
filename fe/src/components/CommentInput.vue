<script setup lang="ts">
import { nextTick, ref } from 'vue';
import TextareaWithBtn from './TextareaWithBtn.vue';

export type NewContent = {
  content: string;
  author: string;
}

const props = defineProps<{
  modelValue: NewContent
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', value: NewContent): void,
  (e: 'post', value: { author: string, content: string }): void,
}>();
const nameRef = ref<HTMLElement>();
const onSend = () => {
  nextTick(() => {
    nameRef.value?.focus();
  });
}
const onEnterName = (e: KeyboardEvent) => {
  if (e.key === 'Enter') {
    emit('post', {
      author: props.modelValue.author,
      content: props.modelValue.author
    });
  }
}

const onInputContent = (val: string) => {
  emit('update:modelValue', {
    content: val,
    author: props.modelValue.author
  });
}
const onInputAuthor = (e: Event) => {
  emit('update:modelValue', {
    content: props.modelValue.content,
    author: (<HTMLInputElement>e.target)?.value
  });
}
</script>

<template>
  <div>
    <textarea-with-btn
      :model-value="modelValue.content"
      placeholder="Comment không quá 500 ký tự. (Ctrl + Enter)"
      :maxlength="500"
      @update:model-value="onInputContent"
      @post="onSend"
    />
    <input type="text"
      ref="nameRef"
      :value="modelValue.author"
      placeholder="Tên của bạn (tối thiểu 2 ký tự, default: Anonymous)"
      class="c-input comment-name"
      maxlength="30"
      @input="onInputAuthor"
      @keydown="onEnterName">
  </div>
</template>

<style scoped>
.comment-name {
  line-height: 1rem;
}
</style>
