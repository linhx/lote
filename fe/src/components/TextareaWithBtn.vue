<script setup lang="ts">

const props = defineProps<{
  modelValue: string;
  rows?: number;
  placeholder?: string;
  maxlength?: number;
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void,
  (e: 'change', value: string): void,
  (e: 'post', value: string): void,
}>();

const onChange = (e: Event) => {
  emit('change', (<HTMLInputElement>e.target)?.value);
}
const onInput = (e: Event) => {
  emit('update:modelValue', (<HTMLInputElement>e.target)?.value);
}
const onKeyDown = (e: any) => {
  if (e.key === 'Enter' && e.ctrlKey) {
    emit('post', (<HTMLInputElement>e.target)?.value);
    e.target.blur();
  }
}
const onClickEnter = () => {
  emit('post', props.modelValue);
}
</script>

<template>
  <div class="textarea-container">
    <textarea
      :rows="rows"
      :placeholder="placeholder"
      class="resize-y comment-textarea dark:bg-slate-800"
      :value="modelValue"
      :maxlength="maxlength"
      @change="onChange"
      @input="onInput"
      @keydown="onKeyDown"
    ></textarea>
    <button tabindex="-1">
      <img src="../assets/img/enter.svg"
        alt="enter"
        :onClick="onClickEnter"/>
    </button>
  </div>
</template>

<style lang="postcss" scoped>
.textarea-container {
  position: relative;
}
.textarea-container textarea {
  @apply shadow-sm focus:ring-indigo-500 focus:border-indigo-500 mt-1 block w-full sm:text-sm border border-gray-300 dark:border-slate-600 rounded-md;
}
.textarea-container button {
  position: absolute;
  top: 5px;
  right: 15px;
}
</style>