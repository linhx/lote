<script setup lang="ts">
import * as VueI18n from 'vue-i18n';

const { t } = VueI18n.useI18n();
</script>

<template>
  <div class="h-screen flex">
    <span class="m-auto text-2xl">
      404 | {{ t('notfound') }}, <router-link to="/">🏠</router-link>
    </span>
  </div>
</template>