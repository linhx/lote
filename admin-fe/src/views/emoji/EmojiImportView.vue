<script setup lang="ts">
import { ref } from 'vue';
import CFileInput from '../../components/CFileInput.vue';
import CInput from '../../components/CInput.vue';
import FileImageViewer from '../../components/FileImageViewer.vue';
import CButton from '../../components/CButton.vue';
import EmojiCreateDto from '../../dtos/EmojiCreateDto';
import { fileNameWithoutExtension } from '../../utilities/FileUtils';
import EmojiRepository from '../../repositories/EmojiRepository';

const emojis = ref<Array<EmojiCreateDto & { i: number }>>([]);

const onSelectImages = (evt: Event) => {
  emojis.value = [];
  const target = (<HTMLInputElement> evt.target);
  const files = target.files;
  if (!files || !files.length) {
    return;
  }
  let i = 0;
  for (const file of Array.from(files)) {
    const key = fileNameWithoutExtension(file.name);
    emojis.value.push({
      i: i++,
      group: 'custom',
      category: '',
      key: key,
      name: `:${key}:`,
      file: file
    });
  }
}

const clear = () => {
  const ok = window.confirm('Do you want to clear?');
  if (ok) {
    emojis.value = [];
  }
}

const isLoading = ref(false);
const remove = (emoji: EmojiCreateDto & { i: number }) => {
  const index = emojis.value.findIndex(e => e.i === emoji.i);
  if (index > -1) {
    emojis.value.splice(index, 1);
  }
}

const fileInput = ref();

const onSave = () => {
  isLoading.value = true;
  EmojiRepository.import(emojis.value).then(() => {
    emojis.value = [];
    fileInput.value.clear();
  }).finally(() => {
    isLoading.value = false;
  });
}
</script>

<template>
  <div class="w-full mt-10 sm:mt-0 shadow p-3">
    <div class="flex flex-row">
      <div class="mt-5 md:mt-0 md:col-span-1">
        <c-field label="Image">
          <c-file-input ref="fileInput" accept="image/*" multiple name="image" @change="onSelectImages" />
        </c-field>
      </div>
      <c-button varian="red" @click="clear" class="ml-5">{{ $t('clear') }}</c-button>
    </div>
    <table class="w-full text-sm text-left text-gray-500 dark:text-gray-400">
      <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
        <tr>
          <th scope="col" class="py-3 px-6">Image</th>
          <th scope="col" class="py-3 px-6">Group</th>
          <th scope="col" class="py-3 px-6">Category</th>
          <th scope="col" class="py-3 px-6">Key</th>
          <th scope="col" class="py-3 px-6">Name</th>
          <th scope="col" class="py-3 px-6"></th>
        </tr>
      </thead>
      <tbody>
        <tr class="bg-white border-b dark:bg-gray-800 dark:border-gray-700" :key="emoji.key" v-for="emoji in emojis">
          <td class="py-4 px-6">
            <file-image-viewer v-if="emoji.file" :file="emoji.file" class="h-10"></file-image-viewer>
          </td>
          <td class="py-4 px-6">
            <c-input v-model="emoji.group"></c-input>
          </td>
          <td class="py-4 px-6">
            <c-input v-model="emoji.category"></c-input>
          </td>
          <td class="py-4 px-6">
            <c-input v-model="emoji.key"></c-input>
          </td>
          <td class="py-4 px-6">
            <c-input v-model="emoji.name"></c-input>
          </td>
          <td class="py-4 px-6">
            <c-button varian="red" @click="remove(emoji)">{{ $t('remove') }}</c-button>
          </td>
        </tr>
      </tbody>
    </table>

    <div class="mt-5 md:mt-0 md:col-span-3 items-center">
      <c-button variant="green" @click="onSave" :disabled="isLoading">Save</c-button>
    </div>
  </div>
</template>
