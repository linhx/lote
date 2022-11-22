<script setup lang="ts">
import { nextTick, ref } from 'vue';
import * as VueI18n from 'vue-i18n';
import TextareaWithBtn from './TextareaWithBtn.vue';

export type NewContent = {
  content: string;
  authorName: string;
}

const { t } = VueI18n.useI18n();

const props = defineProps<{
  modelValue: NewContent
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', value: NewContent): void,
  (e: 'post', value: { authorName: string, content: string }): void,
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
      authorName: props.modelValue.authorName,
      content: props.modelValue.content
    });
  }
}
const send = () => {
  emit('post', {
    authorName: props.modelValue.authorName,
    content: props.modelValue.content
  });
}

const onInputContent = (val: string) => {
  emit('update:modelValue', {
    content: val,
    authorName: props.modelValue.authorName
  });
}
const onInputAuthorName = (e: Event) => {
  emit('update:modelValue', {
    content: props.modelValue.content,
    authorName: (<HTMLInputElement>e.target)?.value
  });
}
</script>

<template>
  <div>
    <textarea-with-btn
      :model-value="modelValue.content"
      :placeholder="t('comment.content.placeholder')"
      :maxlength="500"
      @update:model-value="onInputContent"
      @post="onSend"
    />
    <div class="flex items-center mt-2">
      <input type="text"
        ref="nameRef"
        :value="modelValue.authorName"
        :placeholder="t('comment.name.placeholder')"
        class="c-input comment-name border-slate-600 dark:bg-slate-800"
        maxlength="30"
        @input="onInputAuthorName"
        @keydown="onEnterName">
      <button class="w-9 h-9 inline-block rounded-full hover:shadow-md overflow-hidden ml-1" @click="send">
        <img src="../assets/img/icon-send-letter-48.png"/>
      </button>
    </div>
  </div>
</template>

<style scoped>
.comment-name {
  line-height: 1rem;
}
</style>
