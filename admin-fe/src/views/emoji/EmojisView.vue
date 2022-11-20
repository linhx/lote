<script setup lang="ts">
import { onBeforeMount, ref } from 'vue';
import EmojiItemListDto from '../../dtos/EmojiItemListDto';
import EmojiRepository from '../../repositories/EmojiRepository';
import { useLoading } from 'vue-loading-overlay';
import { getResponseError } from '../../utilities/ErrorUtils';
import routes from '../../constants/routes';

const $loading = useLoading();

const emojis = ref<EmojiItemListDto[]>();

onBeforeMount(() => {
  const loader = $loading.show();
  EmojiRepository.getAll()
    .then((data) => {
      emojis.value = data.items;
    })
    .catch((e) => {
      alert(getResponseError(e));
    })
    .finally(() => {
      loader.hide();
    });
});
</script>

<template>
  <div class="w-full mx-auto">
    <table class="w-full text-sm text-left text-gray-500 dark:text-gray-400">
      <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
        <tr>
          <th scope="col" class="py-3 px-6">ID</th>
          <th scope="col" class="py-3 px-6">Group</th>
          <th scope="col" class="py-3 px-6">Key</th>
          <th scope="col" class="py-3 px-6">Name</th>
          <th scope="col" class="py-3 px-6">Image</th>
          <th scope="col"></th>
        </tr>
      </thead>
      <tbody>
        <tr class="bg-white border-b dark:bg-gray-800 dark:border-gray-700" :key="emoji.id" v-for="emoji in emojis">
          <th scope="row" class="py-4 px-6 font-medium text-gray-900 whitespace-nowrap dark:text-white">
            {{ emoji.id }}
          </th>
          <td class="py-4 px-6">
            {{ emoji.group }}
          </td>
          <td class="py-4 px-6">
            {{ emoji.key }}
          </td>
          <td class="py-4 px-6">
            {{ emoji.name }}
          </td>
          <td class="py-4 px-6">
            <img :src="emoji.url" width="30" height="30" />
          </td>
          <td class="py-4 px-6">
            <router-link :to="{ name: routes.EMOJI_UPDATE, params: { id: emoji.id } }">{{ $t('edit') }}</router-link>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
