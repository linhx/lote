<template>
  <div class="flex">
    <div class="body pl-5 text-left space-y-1 w-full">
      <div class="flex items-center">
        <div class="flex-1 truncate">
          <router-link
            class="w-full text-2xl font-semibold inline-block truncate overflow-ellipsis"
            :class="titleClass" :to="'/note/' + note.id">
            {{ note.title }}
          </router-link>
        </div>
        <div class="w-16 text-right">
          <router-link :to="{ name: 'NOTE_COMMENTS', params: { id: note.id, title: note.title } }" class="p-1 rounded font-semibold inline-block hover:bg-gray-300">
            {{ note.newCommentsCount }} 💬
          </router-link>
        </div>
      </div>
      <div class="font-extralight whitespace-pre-wrap w-full">
        <div class="whitespace-nowrap truncate">{{ note.overview }}</div>
        <div class="mt-2.5">
          <span class="text-gray-600 mr-2 text-sm">{{ dateFormat }}</span>
          <span v-for="tag in note.tags" :key="tag" class="text-gray-600 text-sm bg-gray-200 p-1 mx-1">
            {{ tag }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';
import NoteItemListDto from '../../dtos/NoteItemListDto';

const STATE = {
  DRAFT: 'draft',
  UPDATE: 'update',
  PUBLISH: 'publish'
}

export default defineComponent({
  props: {
    note: {
      type: Object as PropType<NoteItemListDto>,
      required: true
    }
  },
  computed: {
    dateFormat() {
      return new Date(this.note.createdAt).toLocaleDateString('vi-VN');
    },
    state() {
      if (!this.note.isPublished) {
        return STATE.DRAFT;
      }
      if (this.note.updatedAt > this.note.updatePublicationAt) {
        return STATE.UPDATE;
      }
      return STATE.PUBLISH;
    },
    titleClass() {
      return 'state-' + this.state;
    }
  }
});
</script>

<style lang="postcss">
.state-draft {
  @apply text-red-600;
}
.state-update {
  @apply text-yellow-600;
}
.state-publish {
  @apply text-blue-600;
}
</style>

<style scoped lang="postcss">
.overview {
  @apply overflow-hidden overflow-ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
}
</style>