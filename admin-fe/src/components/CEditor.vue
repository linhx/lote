<template>
  <div class="c-editor border border-gray-300 rounded-md">
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
import BlotFormatter from 'quill-blot-formatter';
// import Parchment from 'parchment';
import { sanitize } from 'quill/formats/link';
import debounce from 'lodash.debounce';
import FileRepository from '../repositories/FileRepository';
import ResFileDto from "../dtos/ResFileDto";

Quill.register('modules/blotFormatter', BlotFormatter);

const BubbleTheme = Quill.import("themes/bubble");
class ExtendBubbleTheme extends BubbleTheme {
  constructor(quill: any, options: any) {
    super(quill, options);

    quill.container.addEventListener('contextmenu', (e: Event) => {
      e.preventDefault();
      quill.theme.tooltip.edit();
      quill.theme.tooltip.show();
      return false;
    });
  }
}

Quill.register("themes/bubble", ExtendBubbleTheme);

const ATTRIBUTES = ['alt', 'height', 'width'];

class Image extends Quill.import('blots/embed') {
  static create(value: ResFileDto) {
    const node = super.create(value);
    node.setAttribute('src', this.sanitize(value.url));
    return node;
  }

  static formats(domNode) {
    return ATTRIBUTES.reduce((formats, attribute) => {
      if (domNode.hasAttribute(attribute)) {
        formats[attribute] = domNode.getAttribute(attribute);
      }
      return formats;
    }, {});
  }

  static match(url) {
    return /\.(jpe?g|gif|png)$/.test(url) || /^data:image\/.+;base64/.test(url);
  }

  static register() {
    if (/Firefox/i.test(navigator.userAgent)) {
      setTimeout(() => {
        // Disable image resizing in Firefox
        document.execCommand('enableObjectResizing', false, false);
      }, 1);
    }
  }

  static sanitize(url) {
    return sanitize(url, ['http', 'https', 'data']) ? url : '//:0';
  }

  static value(domNode) {
    return domNode.getAttribute('src');
  }

  format(name, value) {
    if (ATTRIBUTES.indexOf(name) > -1) {
      if (value) {
        this.domNode.setAttribute(name, value);
      } else {
        this.domNode.removeAttribute(name);
      }
    } else {
      super.format(name, value);
    }
  }
}
Image.blotName = 'image';
Image.tagName = 'IMG';
Quill.register(Image, true);

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
      this.$editor?.insertEmbed(rangeIndex, 'image', tempFile, Quill.sources.USER);
      this.$editor?.setSelection(rangeIndex + 1, 0, Quill.sources.SILENT);
    }
  },
  mounted() {
    this.$editor = new Quill(`#${this.editorId}`, {
      theme: 'bubble',
      modules: {
        toolbar: [
          [{ "font": [] }, { "size": ["small", false, "large", "huge"] }],
          ["bold", "italic", "underline", "strike"],
          [{ "color": [] }, { "background": [] }],
          [{ "script": "sub" }, { "script": "super" }],
          [{ "header": 1 }, { "header": 2 }, "blockquote", "code-block"],
          [{ "list": "ordered" }, { "list": "bullet" }, { "indent": "-1" }, { "indent": "+1" }],
          [{ "direction": "rtl" }, { "align": [] }],
          ["link", "image", "video"],
          ["clean"]
        ],
        blotFormatter: {}
      },
    });
    this.$editor.on('text-change', (delta, oldContents, source: String) => {
      // this.onChange();
      console.log(this.$editor.getContents());
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