<template>
  <div class="mt-10 sm:mt-0 shadow p-3">
    <div class="md:grid md:grid-cols-3 md:gap-6">
      <div class="mt-5 md:mt-0 md:col-span-1">
        <c-field label="Title">
          <c-input v-model="note.title" name="title" @change="onChangeTitle" />
        </c-field>
      </div>
      <div class="mt-5 md:mt-0 md:col-span-1">
        <c-field label="Permalink">
          <c-input v-model="note.permalink" name="permalink" />
        </c-field>
      </div>
      <div class="mt-5 md:mt-0 md:col-span-1">
        <c-field label="Banner">
          <c-file-input accept="image/*" name="banner" @change="onChangeBanner" />
        </c-field>
      </div>
      <div class="mt-5 md:mt-0 md:col-span-3">
        <c-field label="Overview">
          <c-textarea v-model="note.overview" name="overview" />
        </c-field>
      </div>
      <div class="mt-5 md:mt-0 md:col-span-1">
        <c-field label="Tags">
          <c-tag-input v-model="note.tags"></c-tag-input>
        </c-field>
      </div>
      <div class="mt-5 md:mt-0 md:col-span-3 w-full max-w-3xl mx-auto">
        <c-field label="Content">
          <c-editor ref="editor" class="-mx-4"></c-editor>
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
import NoteRepository from '../../repositories/NoteRepository';
import FileRepository from "../../repositories/FileRepository";
import { convertFreeTextToKebabCase } from '../../utilities/StringUtils';
import NoteDto from '../../dtos/NoteDto';
import ROUTES_NAME from '../../constants/routes';
import { Data } from '../../utilities/Editor';
import { getResponseError } from '../../utilities/ErrorUtils';
import { ActiveLoader } from 'vue-loading-overlay';

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
    note: {
      title: string,
      permalink: string,
      overview: string,
      tags: string[],
      category: number,
    },
    noteBanner?: File
  } {
    return {
      isLoading: false,
      note: {
        title: '',
        permalink: '',
        overview: '',
        tags: [],
        category: 0,
      },
      noteBanner: undefined
    }
  },
  methods: {
    onChangeTitle() {
      this.note.permalink = convertFreeTextToKebabCase(this.note.title) || '';
    },
    async uploadNoteBanner() {
      if (this.noteBanner) {
        const file = await FileRepository.uploadFile(this.noteBanner);
        return file.id;
      }
    },
    showLoading() {
      this.isLoading = true;
      return this.$loading.show();
    },
    hideLoading(loader: ActiveLoader) {
      this.isLoading = false;
      loader.hide();
    },
    async onSave() {
      const loader = this.showLoading();
      try {
        const banner = await this.uploadNoteBanner();
        const data: Data = (<any>this.$refs.editor).getData();
        await NoteRepository.create({
          ...this.note,
          banner,
          ...data
        })
        .then((res: NoteDto) => {
          window.removeEventListener('beforeunload', warningUnsave);
          this.$router.push({
            name: ROUTES_NAME.NOTE_UPDATE,
            params: { id: res.id }
          });
        })
        .catch(e => {
          alert(getResponseError(e));
        });
      } catch(e: any) {
        alert(e.message);
      } finally {
        this.hideLoading(loader);
      }
    },
    onChangeBanner(e: Event) {
      const target = (<HTMLInputElement> e.target);
      const file = target.files && target.files.length ? target.files[0] : null;
      if (!file) {
        return;
      }
      this.noteBanner = file;
    }
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
