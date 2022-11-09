<template>
  <div class="mt-10 sm:mt-0 shadow p-3">
    <div class="md:grid md:grid-cols-3 md:gap-6">
      <div class="mt-5 md:mt-0 md:col-span-1">
        <c-field label="Title">
          <c-input v-model="todayILearned.title" name="title" @change="onChangeTitle" />
        </c-field>
      </div>
      <div class="mt-5 md:mt-0 md:col-span-2">
        <c-field label="Permalink">
          <c-input v-model="todayILearned.permalink" name="permalink" />
        </c-field>
      </div>
      <div class="mt-5 md:mt-0 md:col-span-3 w-full max-w-3xl mx-auto">
        <c-field label="Content">
          <c-editor ref="editor" class="-mx-4"></c-editor>
        </c-field>
      </div>
      <div class="mt-5 md:mt-0 md:col-span-2">
        <c-field label="Tags">
          <c-tag-input v-model="todayILearned.tags"></c-tag-input>
        </c-field>
      </div>
      <div class="mt-5 md:mt-0 md:col-span-3 items-center">
        <c-button variant="green" @click="onSave" :disabled="isLoading">Save</c-button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import CInput from '../../components/CInput.vue';
import CTextarea from '../../components/CTextarea.vue';
import CEditor from '../../components/CEditor.vue';
import CField from '../../components/CField.vue';
import CTagInput from '../../components/CTagInput.vue';
import CButton from '../../components/CButton.vue';
import CFileInput from '../../components/CFileInput.vue';
import TodayILearnedRepository from '../../repositories/TodayILearnedRepository';
import FileRepository from "../../repositories/FileRepository";
import { convertFreeTextToKebabCase } from '../../utilities/StringUtils';
import TodayILearnedDto from '../../dtos/TodayILearnedDto';
import ROUTES_NAME from '../../constants/routes';
import { Data } from '../../utilities/Editor';

const confirmationMessage = 'Warning unsaved changes'; // TODO message source

const warningUnsave = (e: any) => {
  (e || window.event).returnValue = confirmationMessage; //Gecko + IE
  return confirmationMessage;
}

export default defineComponent({
  components: {
    CField,
    CInput,
    CTextarea,
    CEditor,
    CTagInput,
    CButton,
    CFileInput
},
  data (): {
    isLoading: boolean,
    todayILearned: {
      title: string,
      permalink: string,
      tags: string[],
      category: number,
    },
  } {
    return {
      isLoading: false,
      todayILearned: {
        title: '',
        permalink: '',
        tags: [],
        category: 0,
      }
    }
  },
  methods: {
    onChangeTitle() {
      this.todayILearned.permalink = convertFreeTextToKebabCase(this.todayILearned.title) || '';
    },
    async onSave() {
      try {
        this.isLoading = true;
        const data: Data = (<any>this.$refs.editor).getData();
        await TodayILearnedRepository.create({
          ...this.todayILearned,
          ...data
        })
        .then((res: TodayILearnedDto) => {
          window.removeEventListener('beforeunload', warningUnsave);
          this.$router.push({
            name: ROUTES_NAME.TODAY_I_LEARNED_UPDATE,
            params: { id: res.id }
          });
        })
        .catch(e => {
          alert(e.response?.message);
        });
      } catch(e: any) {
        alert(e.message);
      } finally {
        this.isLoading = false;
      }
    },
  },
  beforeRouteEnter() {
    window.addEventListener('beforeunload', warningUnsave);
  },
  beforeRouteLeave(to, from , next)  {
    const answer = window.confirm(confirmationMessage);
    if (answer) {
      window.removeEventListener('beforeunload', warningUnsave);
      next();
    } else {
      next(false);
    }
  }
});
</script>
