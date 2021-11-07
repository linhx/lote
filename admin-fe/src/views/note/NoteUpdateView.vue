<template>
  <div class="mt-10 sm:mt-0 shadow p-3">
    <div class="md:grid md:grid-cols-3 md:gap-6">
      <div class="mt-5 md:mt-0 md:col-span-1">
        <c-field label="Title">
          <c-input v-model="note.title" name="title" />
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
      <div class="mt-5 md:mt-0 md:col-span-3">
        <c-field label="Content">
          <c-editor ref="editor" editor-class="h-32"></c-editor>
        </c-field>
      </div>
      <div class="mt-5 md:mt-0 md:col-span-2">
        <c-field label="Tags">
          <c-tag-input v-model="note.tags"></c-tag-input>
        </c-field>
      </div>
      <div class="mt-5 md:mt-0 md:col-span-3 items-center">
        <c-button variant="green" @click="onSave" :disabled="isLoading">Save</c-button>
        <c-button variant="green" class="ml-2" @click="publish" :disabled="isLoading">Publish</c-button>
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
import NoteUpdateDto from '../../dtos/NoteUpdateDto';

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
  props: {
    id: {
      type: String,
      required: true
    }
  },
  data (): {
    isLoading: boolean,
    note: NoteUpdateDto,
    noteBanner?: File
  } {
    return {
      isLoading: false,
      note: {
        id: '',
        title: '',
        permalink: '',
        overview: '',
        content: '',
        tags: [],
        category: 0,
      },
      noteBanner: undefined
    }
  },
  methods: {
    async uploadNoteBanner() {
      if (this.noteBanner) {
        const file = await FileRepository.uploadTempFile(this.noteBanner);
        return file.id;
      }
    },
    async onSave() {
      // TODO
    },
    onChangeBanner(e: Event) {
      const target = (<HTMLInputElement> e.target);
      const file = target.files && target.files.length ? target.files[0] : null;
      if (!file) {
        return;
      }
      this.noteBanner = file;
    },
    publish() {
      this.isLoading = true;
      NoteRepository.publish(this.id)
      .then(() => {
        this.isLoading = false;
      }).catch((e: Error) => {
        this.isLoading = false;
        alert(e.message);
      });
    }
  },

  beforeMount() {
    NoteRepository.findById(this.id).then(res => {
      const {
        content,
        ...rest
      } = res;
      this.note = {
        ...rest,
        content: JSON.parse(content)
      };
      (<any>this.$refs.editor).setContents(this.note.content);
    }).catch((e: Error) => {
      alert(e.message);
    });
  }
});
</script>