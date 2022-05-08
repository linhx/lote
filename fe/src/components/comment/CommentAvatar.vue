<script lang="ts">
const splitFixedLength = (str: string, size: number, prefix: string) => {
  const numChunks = Math.ceil(str.length / size);
  const chunks = new Array(numChunks);

  for (let i = 0, o = 0; i < numChunks; i++, o += size) {
    chunks[i] = prefix + str.substring(o, o + size);
  }

  return chunks;
}
</script>

<script setup lang="ts">
import { computed } from 'vue';
import BeamAvatar from './BeamAvatar.vue';

const props = defineProps<{
  hash: string;
  name: string;
}>();

const COLOR_HEX_LENGTH = 6;

const colors = computed(() => {
  const missingHex = COLOR_HEX_LENGTH - (props.hash.length % COLOR_HEX_LENGTH);
  const filledHash = props.hash + '0'.repeat(missingHex);
  return splitFixedLength(filledHash, COLOR_HEX_LENGTH, '#');
});

</script>

<template>
  <beam-avatar
    :colors="colors"
    :name="name"
    :size="48"
  ></beam-avatar>
</template>
