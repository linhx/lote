<script setup lang="ts">
import { onBeforeMount, ref } from 'vue';

const props = defineProps<{
  file: File;
}>();

const url = ref();
let reader: FileReader;
onBeforeMount(() => {
  reader = new FileReader();
  reader.onload = function (e) {
    url.value = e.target?.result;
  }
  reader.readAsDataURL(props.file);
});
</script>

<template>
  <img :src="url">
</template>
