<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    showClose?: boolean;
    src: string;
  }>(),
  {
    showClose: true,
  }
);

const emit = defineEmits<{
  (e: 'close', value: boolean): void;
}>();

const close = () => {
  emit('close', true);
};
</script>

<template>
  <div class="relative h-full w-full flex justify-center items-center">
    <button v-if="showClose" type="button" class="btn-close z-10 absolute top-3 right-3" @click="close">
      <svg
        class="w-8 h-8 bg-slate-300/50 rounded-md focus:outline-none"
        fill="currentColor"
        viewBox="0 0 20 20"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          fill-rule="evenodd"
          d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
          clip-rule="evenodd"
        ></path>
      </svg>
    </button>
    <div class="w-full h-full bg-contain bg-center bg-no-repeat" :style="{
      backgroundImage: `url('${src}')`
    }"></div>
  </div>
</template>
