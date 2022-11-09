<script setup lang="ts">
import * as VueI18n from 'vue-i18n';
import { storeToRefs } from 'pinia';
import { useNotesStore } from '../stores/notes';
import { computed, onBeforeMount, onUnmounted, ref, watch } from 'vue';
import { useRoute } from 'vue-router';
const noteStore = useNotesStore();
const { fetched } = storeToRefs(noteStore);
defineProps<{
  innerClass?: string;
}>();

const { t } = VueI18n.useI18n();

const route = useRoute();

const isHomePage = computed(() => route.path === "/");

const isTop = ref(true);
const onScroll = () => {
  isTop.value = window.scrollY <= 0;
}

onBeforeMount(() => {
  window.addEventListener('scroll', onScroll);
});
onUnmounted(() => {
  window.removeEventListener('scroll', onScroll);
});
</script>

<template>
  <div class="header-wrapper w-full">
    <div class="header w-full bg-white transition-all box-border z-10 fixed top-0" :class="{ 'fixed-header': !isTop }">
      <div class="text-gray-800 h-full flex items-center flex-wrap" :class="innerClass">
        <template v-if="isHomePage">
          <h2 class="title m-0 text-3xl hidden xs:inline" :class="{ loading: !fetched }">{{ t('blogName') }}<span class="cursor-blinking">_</span></h2>
          <svg class="xs:hidden" width="30" height="40" viewBox="0 0 384 512">
            <path style="fill: none; stroke: #292929; mix-blend-mode: source-over; stroke-dasharray: none; stroke-dashoffset: 0; stroke-linecap: round; stroke-linejoin: round; stroke-miterlimit: 4; stroke-opacity: 1; stroke-width: 147;" sketchjs:tool="pencil" d="M0 0 C0 0 0 3.9 0 3.9 0 3.9 0 0 0 0 0 0 0 12.875 0 17.58 0 20.736 0 22.957 0 25.49 0 27.832 0 29.918 0 32.25 0 34.752 0 37.289 0 40.03 0 43.104 0 46.222 0 49.81 0 54.199 0 59.22 0 64.45 0 70.487 0 78.035 0 83.96 0 88.918 0 92.842 0 97.62 0 102.893 0 109.093 0 114.26 0 118.765 0 122.618 0 126.91 0 131.359 0 136.341 0 140.5 0 144.03 0 147.216 0 150.29 0 153.027 0 155.646 0 158.05 0 160.138 0 161.875 0 163.9 0 166.089 0 168.644 0 170.73 0 172.493 0 174.071 0 175.61 0 176.991 0 178.161 0 179.54 0 181.072 0 182.698 0 184.39 0 186.249 0 188.486 0 190.24 0 191.674 0 192.848 0 194.15 0 195.451 0 196.677 0 198.05 0 199.586 0 201.37 0 202.93 0 204.367 0 205.831 0 207.07 0 208.08 0 208.826 0 209.82 0 210.996 0 212.383 0 213.67 0 214.963 0 216.19 0 217.56 0 219.095 0 220.735 0 222.44 0 224.318 0 226.398 0 228.36 0 230.301 0 232.302 0 234.15 0 235.846 0 237.611 0 239.03 0 240.128 0 240.852 0 241.95 0 243.369 0 245.294 0 246.83 0 248.203 0 249.43 0 250.73 0 252.03 0 253.551 0 254.63 0 255.395 0 255.938 0 256.59 0 257.241 0 258.002 0 258.54 0 258.919 0 259.186 0 259.51 0 259.836 0 260.306 0 260.49 0 260.562 0 260.562 0 260.64 0 260.913 0 261.868 0 262.49 0 263.124 0 263.704 0 264.41 0 265.28 0 266.225 0 267.32 0 268.738 0 270.664 0 272.2 0 273.573 0 274.992 0 276.1 0 276.923 0 277.563 0 278.25 0 278.882 0 279.437 0 280.07 0 280.759 0 281.41 0 282.23 0 283.315 0 284.751 0 286.01 0 287.267 0 288.444 0 289.78 0 291.297 0 293.019 0 294.64 0 296.262 0 297.977 0 299.51 0 300.882 0 302.203 0 303.41 0 304.456 0 305.363 0 306.34 0 307.317 0 308.392 0 309.27 0 309.986 0 310.681 0 311.22 0 311.602 0 311.874 0 312.2 0 312.524 0 312.791 0 313.17 0 313.708 0 314.581 0 315.12 0 315.502 0 315.774 0 316.1 0 316.424 0 316.691 0 317.07 0 317.608 0 318.369 0 319.02 0 319.672 0 320.44 0 320.98 0 321.36 0 321.626 0 321.95 0 322.276 0 322.582 0 322.93 0 323.328 0 323.828 0 324.21 0 324.519 0 324.71 0 325.05 0 325.576 0 326.526 0 327.06 0 327.413 0 327.592 0 327.94 0 328.445 0 329.112 0 329.8 0 330.658 0 331.724 0 332.69 0 333.661 0 334.872 0 335.61 0 336.061 0 336.352 0 336.7 0 337.02 0 337.62 0 337.62 " transform="matrix(1,0,0,1,101.87804878048792,85.53658536585368)"/>
            <path style="fill: none; stroke: #292929; mix-blend-mode: source-over; stroke-dasharray: none; stroke-dashoffset: 0; stroke-linecap: round; stroke-linejoin: round; stroke-miterlimit: 4; stroke-opacity: 1; stroke-width: 147;" sketchjs:tool="pencil" d="M0 0 L0.01 0.01 " transform="matrix(1,0,0,1,288.8112245,423.30102039999997)"/>
          </svg>
          <router-link to="/today-i-learned" class="lowercase text-gray-800 hover:underline hover:text-gray-700 ml-auto">
            /{{ t('today-I-Learned') }}
          </router-link>
        </template>
        <template v-else>
          <router-link
            v-for="breadcrumb in route.meta.breadcrumbs as any"
            :to="breadcrumb.path"
            class="lowercase text-gray-800 hover:underline hover:text-gray-700 text-sm sm:text-base">
            {{ breadcrumb.label }}
          </router-link>
        </template>
      </div>
    </div>
  </div>
</template>

<style scoped>
.header-wrapper {
  padding-bottom: var(--header-height);
}
.header {
  height: var(--header-height);
}
.fixed-header {
  box-shadow: 0 2px 5px 0 rgba(16, 15, 15, 0.3);
  height: var(--header-height-small);
}

.loading {
  @apply animate-pulse text-red-900;
  animation-duration: 500ms;
}
.title {
  transition: font-size 150ms;
}
.fixed-header .title {
  @apply text-2xl;
}
.cursor-blinking {
  animation: ping 1s cubic-bezier(0.79,-0.26, 0.65,-0.13) infinite;
}
</style>