<template>
  <div class="c-editor">
    <div :id="editorId" v-html="value" :class="editorClass">
    </div>
    <input
      ref="inputFile"
      type="file"
      accept="image/png, image/gif, image/jpeg, image/bmp, image/x-icon"
      class="hidden"
      @change="onChangeFile"
       />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import Quill from 'quill';
import debounce from 'lodash.debounce';
import FileRepository from '../repositories/FileRepository';

export default defineComponent({
  $editor: null,
  props: {
    modelValue: String,
    editorClass: String
  },
  data(): {
      $editor?: Quill | null,
      value: string | undefined
    } {
    return {
      value: this.modelValue
    }
  },
  computed: {
    editorId() {
      return this.safeId('editor');
    }
  },
  methods: {
    onChange: debounce(function (this: any) {
      this.$emit('update:modelValue', this.$editor?.root.innerHTML)
    }, 700),
    async onChangeFile(e: Event) {
      const target = (<HTMLInputElement> e.target);
      const file = target.files && target.files.length ? target.files[0] : null;
      if (!file) {
        return;
      }
      target.value = '';

      const tempFile = await FileRepository.uploadTempFile(file);
      const range = this.$editor?.getSelection(true);
      const rangeIndex = range?.index || 0;
      this.$editor?.insertEmbed(rangeIndex, 'image', tempFile.url, Quill.sources.USER);
      this.$editor?.setSelection(rangeIndex + 1, 0, Quill.sources.SILENT);
    }
  },
  mounted() {
    this.$editor = new Quill(`#${this.editorId}`, {
      theme: 'snow',
      modules: {
        toolbar: [
          [{ "font": [] }, { "size": ["small", false, "large", "huge"] }],
          ["bold", "italic", "underline", "strike"],
          [{ "color": [] }, { "background": [] }],
          [{ "script": "sub" }, { "script": "super" }],
          [{ "header": 1 }, { "header": 2 }, "blockquote", "code-block"],
          [{ "list": "ordered" }, { "list": "bullet" }, { "indent": "-1" }, { "indent": "+1" }],
          [{ "direction": "rtl" }, { "align": [] }],
          ["link", "image", "video", "formula"],
          ["clean"]
        ]
      },
    });
    this.$editor.on('text-change', () => {
      this.onChange();
    });
    var toolbar = this.$editor.getModule('toolbar');
    toolbar.addHandler('image', (img: any) => {
      (<HTMLElement>this.$refs.inputFile).click();
    });
  },
  beforeUnmount() {
    this.$editor = null;
  }
});
</script>

<style>
.c-editor > .ql-toolbar {
  border-top-left-radius: 0.375rem;
  border-top-right-radius: 0.375rem;
}
.c-editor > .ql-container {
  border-bottom-left-radius: 0.375rem;
  border-bottom-right-radius: 0.375rem;
  font-size: 16px;
}

</style>