<script setup lang="ts">
import { ref } from 'vue';
import CField from '../../components/CField.vue';
import CInput from '../../components/CInput.vue';
import CFileInput from '../../components/CFileInput.vue';
import CButton from '../../components/CButton.vue';
import EmojiCreateDto from '../../dtos/EmojiCreateDto';
import EmojiRepository from '../../repositories/EmojiRepository';
import { useLoading } from 'vue-loading-overlay';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';
import routes from '../../constants/routes';
import { getResponseError } from '../../utilities/ErrorUtils';

const { t } = useI18n();
const $loading = useLoading();
const emoji = ref<EmojiCreateDto>({
  group: 'custom',
  category: '',
  key: '',
  name: '',
});
const isLoading = ref(false);

const onChangeImage = (e: Event) => {
  const target = (<HTMLInputElement> e.target);
  const file = target.files && target.files.length ? target.files[0] : null;
  if (!file) {
    return;
  }
  emoji.value.file = file;
}

const router = useRouter();
const onSave = () => {
  const loader = $loading.show();
  isLoading.value = true;
  EmojiRepository.create(emoji.value)
  .then(() => {
    alert(t('message.succeed'));
  })
  .catch((e) => {
    alert(getResponseError(e));
  })
  .finally(() => {
    isLoading.value = false;
    loader.hide();
    router.push({ name: routes.EMOJIS });
  })
}
</script>

<template>
  <div class="mt-10 sm:mt-0 shadow p-3">
    <div class="md:grid md:grid-cols-3 md:gap-6">
      <div class="mt-5 md:mt-0 md:col-span-1">
        <c-field label="Group">
          <c-input v-model="emoji.group" name="group" disabled />
        </c-field>
      </div>
      <div class="mt-5 md:mt-0 md:col-span-1">
        <c-field label="Category">
          <c-input v-model="emoji.category" name="category" />
        </c-field>
      </div>
      <div class="mt-5 md:mt-0 md:col-span-1">
        <c-field label="Key">
          <c-input v-model="emoji.key" name="key" />
        </c-field>
      </div>
      <div class="mt-5 md:mt-0 md:col-span-1">
        <c-field label="Name">
          <c-input v-model="emoji.name" name="name" />
        </c-field>
      </div>
      <div class="mt-5 md:mt-0 md:col-span-1">
        <c-field label="Image">
          <c-file-input accept="image/*" name="image" @change="onChangeImage" />
        </c-field>
      </div>
      <div class="mt-5 md:mt-0 md:col-span-3 items-center">
        <c-button variant="green" @click="onSave" :disabled="isLoading">Save</c-button>
      </div>
    </div>
  </div>
</template>
