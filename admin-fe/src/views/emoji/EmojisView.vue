<script setup lang="ts">
import { onBeforeMount, ref } from 'vue';
import Pagination from '../../components/Pagination.vue';
import EmojiItemListDto from '../../dtos/EmojiItemListDto';
import EmojiRepository from '../../repositories/EmojiRepository';
import { useLoading } from 'vue-loading-overlay';
import { getResponseError } from '../../utilities/ErrorUtils';
import routes from '../../constants/routes';

const $loading = useLoading();

const emojis = ref<EmojiItemListDto[]>();

const paginate = ref({
  totalRows: 0,
  rowsPerPage: 10,
  edgeCount: 2,
  modalValue: 1,
});

const getAll = () => {
  const loader = $loading.show();
  return EmojiRepository.getList({
    page: paginate.value.modalValue,
    limit: paginate.value.rowsPerPage,
  })
    .then((data) => {
      emojis.value = data.items;
      paginate.value.totalRows = +data.total;
      paginate.value.modalValue = +data.page;
    })
    .catch((e) => {
      alert(getResponseError(e));
    })
    .finally(() => {
      loader.hide();
    });
};

onBeforeMount(() => {
  getAll();
});
</script>

<template>
  <div class="w-full mx-auto">
    <pagination
      v-bind="paginate"
      v-model.number="paginate.modalValue"
      @change="getAll"
    />
    <table class="w-full text-sm text-left text-gray-500 dark:text-gray-400">
      <thead
        class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400"
      >
        <tr>
          <th scope="col" class="py-3 px-6">Group</th>
          <th scope="col" class="py-3 px-6">Category</th>
          <th scope="col" class="py-3 px-6">Key</th>
          <th scope="col" class="py-3 px-6">Name</th>
          <th scope="col" class="py-3 px-6">Image</th>
          <th scope="col"></th>
        </tr>
      </thead>
      <tbody>
        <tr
          class="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
          :key="emoji.id"
          v-for="emoji in emojis"
        >
          <td class="py-4 px-6">
            {{ emoji.group }}
          </td>
          <td class="py-4 px-6">
            {{ emoji.category }}
          </td>
          <td class="py-4 px-6">
            {{ emoji.key }}
          </td>
          <td class="py-4 px-6">
            {{ emoji.name }}
          </td>
          <td class="py-4 px-6">
            <img :src="emoji.url" class="h-10" />
          </td>
          <td class="py-4 px-6">
            <router-link
              :to="{ name: routes.EMOJI_UPDATE, params: { id: emoji.id } }"
              >{{ $t('edit') }}</router-link
            >
          </td>
        </tr>
      </tbody>
    </table>
    <pagination
      v-bind="paginate"
      v-model.number="paginate.modalValue"
      @change="getAll"
    />
  </div>
</template>
