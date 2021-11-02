<template>
  <div class="mt-10 sm:mt-0 shadow p-3">
    <div class="md:grid md:grid-cols-3 md:gap-6">
      <div class="mt-5 md:mt-0 md:col-span-2">
        <c-field label="Title">
          <c-input v-model="note.title" name="title" />
        </c-field>
      </div>
      <div class="mt-5 md:mt-0 md:col-span-1">
        <c-field label="Permalink">
          <c-input v-model="note.permalink" name="permalink" />
        </c-field>
      </div>
      <div class="mt-5 md:mt-0 md:col-span-3">
        <c-field label="Overview">
          <c-textarea v-model="note.overview" name="overview" />
        </c-field>
      </div>
      <div class="mt-5 md:mt-0 md:col-span-3">
        <c-field label="Content">
          <c-editor v-model="note.content" editor-class="h-32"></c-editor>
        </c-field>
      </div>
      <div class="mt-5 md:mt-0 md:col-span-2">
        <c-field label="Tags">
          <c-tag-input v-model="note.tags"></c-tag-input>
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
import NoteRepository from '../../repositories/NoteRepository';

export default defineComponent({
  components: {
    CField,
    CInput,
    CTextarea,
    CEditor,
    CTagInput,
    CButton
},
  data () {
    return {
      isLoading: false,
      note: {
        title: '',
        permalink: '',
        overview: '',
        content: '',
        tags: [],
        category: 0,
      }
    }
  },
  methods: {
    async onSave() {
      try {
        this.isLoading = true;
        await NoteRepository.create(this.note);
      } finally {
        this.isLoading = false;
      }
    }
  }
});
</script>