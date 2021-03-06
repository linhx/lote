<template>
  <div class="c-editor border border-gray-300 rounded-md">
    <div :id="editorId" :class="editorClass">
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
import { defineComponent, PropType } from 'vue';
import CQuill from './c-editor/CQuill';
import Delta from 'quill-delta';
import FileRepository from '../repositories/FileRepository';
import * as FileUtils from '../utilities/FileUtils';

export default defineComponent({
  $editor: null,
  $delta: null,
  props: {
    content: Object as PropType<Delta>,
    editorClass: String
  },
  data(): {
      $editor?: CQuill | null
    } {
    return {
    }
  },
  computed: {
    editorId() {
      return this.safeId('editor');
    }
  },
  methods: {
    async uploadAndInsertImage(img: File) {
      const tempFile = await FileRepository.uploadTempFile(img);
      const range = this.$editor?.getSelection(true);
      const rangeIndex = range?.index || 0;
      this.$editor?.insertEmbed(rangeIndex, 'imagec', tempFile, CQuill.sources.USER);
      this.$editor?.setSelection(rangeIndex + 1, 0, CQuill.sources.SILENT);
    },
    async onChangeFile(e: Event) {
      const target = (<HTMLInputElement> e.target);
      const file = target.files && target.files.length ? target.files[0] : null;
      if (!file) {
        return;
      }
      target.value = '';

      await this.uploadAndInsertImage(file);
    },
    async insertImageBase64(img: string) {
      const file = await FileUtils.urltoFile(img, FileUtils.randomFileName('png'), 'image/png');
      if (file) {
        await this.uploadAndInsertImage(file);
      }
    },
    pasteImage(node: any, delta: any) {
      const imageBase64 = delta.ops[0]?.insert?.imagec.url;
      this.insertImageBase64(imageBase64);
      return new Delta().insert('');
    },
    getContents() {
      return this.$editor?.getContents();
    },
    setContents(contents: Delta) {
      this.$editor?.setContents(contents);
    }
  },
  mounted() {
    this.$editor = new CQuill(`#${this.editorId}`, {
      theme: 'bubble',
      scrollingContainer: 'html',
      modules: {
        toolbar: {
          container: [
            [{ 'font': [] }, { 'size': ['small', false, 'large', 'huge'] }],
            ['bold', 'italic', 'underline', 'strike', 'code'],
            [{ 'color': [] }, { 'background': [] }],
            [{ 'script': 'sub' }, { 'script': 'super' }],
            [{ 'header': 1 }, { 'header': 2 }, 'blockquote', 'code-block'],
            [{ 'list': 'ordered' }, { 'list': 'bullet' }, { 'indent': '-1' }, { 'indent': '+1' }],
            [{ 'direction': 'rtl' }, { 'align': [] }],
            ['link', 'image', 'video', 'emoji'],
            ['clean'],
          ],
          handlers: {'emoji': function() {}}
        },
        blotFormatter: {},
        clipboard: {
          matchers: [
            ['IMG', this.pasteImage],
          ]
        },
        'emoji-toolbar': true,
      },
    });
    if (this.content) {
      this.$editor.setContents(this.content);
    }
    const toolbar = this.$editor.getModule('toolbar');
    toolbar.addHandler('image', (img: any) => {
      (<HTMLElement>this.$refs.inputFile).click();
    });

    toolbar.addHandler('code-block', (value: boolean) => {
      if (value) {
        const lang = prompt('Input language');
        this.$editor?.format('code-block', lang, 'user');
      } else {
        this.$editor?.format('code-block', false, 'user');
      }
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
}
.ql-clipboard {
  position: fixed;
}
</style>
