<script setup lang="ts">
import { onBeforeMount, onBeforeUnmount } from 'vue';
import NavBar from './components/NavBar.vue';
import NoteRepository from './repositories/NoteRepository';
import { NotificationEvent, NotificationType, NotificationEventData } from './repositories/NotificationEvent';
import { createToast, ToastType } from 'mosha-vue-toastify';
import 'mosha-vue-toastify/dist/style.css';
import { useI18n } from 'vue-i18n';
const { t } = useI18n();

const MAP_TOAST_TYPE = new Map<NotificationType, ToastType>([
  [NotificationType.success, 'success'],
  [NotificationType.error, 'danger'],
  [NotificationType.info, 'info'],
]);

let $notificationEvent: NotificationEvent;
onBeforeMount(() => {
  $notificationEvent = new NotificationEvent();
  $notificationEvent.subscribe((ev) => {
    const data = JSON.parse(ev.data) as NotificationEventData;
    if (!data?.message) {
      return;
    }
    createToast(t(`message.${data.message}`) + (data?.error ? ': ' + data.error : ''), {
      type: MAP_TOAST_TYPE.get(data.type),
    });
  });
});

onBeforeUnmount(() => {
  if ($notificationEvent) {
    $notificationEvent.close();
  }
});

const redeployFe = () => {
  var result = confirm("DANGER: Re-deploy the whole app?");
  if (!result) {
    return;
  }
  return NoteRepository.redeployFe();
}
const redeployOnlyNotes = () => {
  var result = confirm("DANGER: Re-deploy all of the notes?");
  if (!result) {
    return;
  }
  return NoteRepository.redeployOnlyNotes();
}
const recreateAndDeployNotes = () => {
  var result = confirm("DANGER: Re-create and deploy all notes?");
  if (!result) {
    return;
  }
  return NoteRepository.recreateAndDeployNotes();
}
const onClickMenu = (item: string) => {
  if (item === 'redeploy') {
    return redeployFe();
  }
  if (item === 'redeployNotes') {
    return redeployOnlyNotes();
  }
  if (item === 'recreateAndDeployNotes') {
    return recreateAndDeployNotes();
  }
}
</script>

<template>
  <nav-bar @clickMenu="onClickMenu" />
  <div class="min-h-full flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8">
    <div class="w-full space-y-8 p-3">
      <router-view />
    </div>
  </div>
</template>

<style>
#app {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>
