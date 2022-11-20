<template>
  <div ref="editor" class="c-editor border border-gray-300 rounded-md">
    <ckeditor v-if="isShow" :editor="editor" :config="editorConfig" @ready="onEditorReady"></ckeditor>
  </div>
</template>

<script lang="ts">
import CKEditor from '@ckeditor/ckeditor5-vue';
import ClassicEditor from '@linhx/ckeditor5-build';
import { defineComponent } from 'vue';
import { Data } from '../utilities/Editor';
import FileRepository from '../repositories/FileRepository';
import { emojiGroups } from 'messenger-emojis';
import EmojiRepository from '../repositories/EmojiRepository';

const ATTR_DATA_ID = 'data-id';
const IMG_SELECTOR = `img[${ATTR_DATA_ID}]`;

export default defineComponent({
  name: 'app',
  components: {
    ckeditor: CKEditor.component,
  },
  props: {
    modelValue: String,
    uploadUrl: String,
    customEmojis: {
      type: Array
    }
  },
  data(): any {
    emojiGroups.set('custom', this.customEmojis)
    return {
      isShow: false,
      editor: ClassicEditor,
      editorConfig: {
        filemanager: {
          upload({ file, setProgress }: { file: File, setProgress: ({ total, loaded }: { total: number, loaded: number }) => void }) {
            return FileRepository.uploadFile(file, (event) => {
              if (event.lengthComputable) {
                setProgress({
                  total: event.total,
                  loaded: event.loaded
                });
              }
            }).then(res => {
              return {
                ...res,
                urls: { default: new URL(res.url, import.meta.env.VITE_APP_API_URL).href }
              }
            }).catch(() => {
              throw `Cannot upload file: ${file.name}.`;
            });
          }
        },
        image: {
          resizeOptions: [
            {
              name: 'resizeImage:original',
              label: 'Original',
              value: null
            },
            {
              name: 'resizeImage:50',
              label: '50%',
              value: '50'
            },
            {
              name: 'resizeImage:75',
              label: '75%',
              value: '75'
            },
            {
              name: 'resizeImage:100',
              label: '100%',
              value: '100'
            }
          ],
        },
        heading: {
          options: [
            { model: 'paragraph', title: 'Paragraph', class: 'ck-heading_paragraph' },
            {
              model: 'heading1', view: {
                name: 'h1',
                attributes: {
                  class: 'heading',
                }
              }, title: 'Heading 1', class: 'ck-heading_heading1'
            },
            {
              model: 'heading2', view: {
                name: 'h2',
                attributes: {
                  class: 'heading',
                }
              }, title: 'Heading 2', class: 'ck-heading_heading2'
            },
            {
              model: 'heading3', view: {
                name: 'h3',
                attributes: {
                  class: 'heading',
                }
              }, title: 'Heading 3', class: 'ck-heading_heading3'
            },
            {
              model: 'heading4', view: {
                name: 'h4',
                attributes: {
                  class: 'heading',
                }
              }, title: 'Heading 4', class: 'ck-heading_heading4'
            },
            {
              model: 'heading5', view: {
                name: 'h5',
                attributes: {
                  class: 'heading',
                }
              }, title: 'Heading 5', class: 'ck-heading_heading5'
            },
            {
              model: 'heading6', view: {
                name: 'h6',
                attributes: {
                  class: 'heading',
                }
              }, title: 'Heading 6', class: 'ck-heading_heading6'
            },
          ]
        },
        codeBlock: {
          languages: [
            { language: 'plaintext', label: 'Plain text' },
            { language: 'java', label: 'Java' },
            { language: 'js', label: 'JavaScript' },
            { language: 'ts', label: 'TypeScript' },
            { language: 'sql', label: 'SQL' },
            { language: 'pgsql', label: 'PostgreSQL & PL/pgSQL' },
            { language: 'tsql', label: 'Transact-SQL' },
            { language: 'json', label: 'JSON' },
            { language: 'css', label: 'CSS' },
            { language: 'scss', label: 'SCSS' },
            { language: 'styl', label: 'Stylus' },
            { language: 'xml', label: 'XML' },
            { language: 'yaml', label: 'YAML' },
            { language: 'properties', label: 'Properties' },
            { language: 'diff', label: 'Diff' },
            { language: 'html', label: 'HTML' },
            { language: 'php', label: 'PHP' },
            { language: 'sh', label: 'Bash' },
            { language: 'shell', label: 'Shell' },
            { language: 'go', label: 'Go' },
            { language: 'rs', label: 'Rust' },
            { language: 'scala', label: 'Scala' },
            { language: 'gradle', label: 'Gradle' },
            { language: 'graphql', label: 'GraphQL' },
            { language: 'groovy', label: 'Groovy' },
            { language: 'http', label: 'HTTP' },
            { language: 'bat', label: 'DOS' },
            { language: 'python', label: 'Python' },
            { language: 'ps', label: 'PowerShell' },
            { language: 'ruby', label: 'Ruby' },
            { language: 'c', label: 'C' },
            { language: 'cs', label: 'C#' },
            { language: 'cpp', label: 'C++' },
            { language: 'toml', label: 'TOML' },
            { language: 'kt', label: 'Kotlin' },
            { language: 'tex', label: 'LaTeX' },
            { language: 'less', label: 'Less' },
            { language: 'mk', label: 'Makefile' },
            { language: 'md', label: 'Markdown' },
            { language: 'nginx', label: 'Nginx' },
            { language: 'objc', label: 'Objective C' },
            { language: 'objc', label: 'Objective C' },
            { language: 'smali', label: 'Smali' },
            { language: 'svelte', label: 'Svelte' },
            { language: 'swift', label: 'Swift' },
            { language: 'hcl', label: 'Terraform' },
            { language: 'vim', label: 'Vim Script' },
            { language: 'x86asm', label: 'x86 Assembly' },
          ],
        },
        emoji2: {
          defaultGroup: 'p',
          groups: emojiGroups
        }
      }
    };
  },
  methods: {
    /**
     * to avoid backend saving unused image,
     * add `data-id` (image id on backend) to `img`. when saving the content, collect all used image id, then only save the used image.
     * @param {*} editor
     */
    onEditorReady: function (editor: any) {
      editor.model.schema.extend('imageBlock', { allowAttributes: 'dataId' });
      editor.model.schema.extend('imageInline', { allowAttributes: 'dataId' });

      editor.plugins
        .get('ImageUploadEditing')
        .on('uploadComplete', (evt: any, { data, imageElement }: any) => {
          editor.model.change((writer: any) => {
            writer.setAttribute('dataId', data.id, imageElement);
          });
        });
      editor.conversion.for('upcast').attributeToAttribute({
        model: 'dataId',
        view: ATTR_DATA_ID,
      });

      editor.conversion.for('downcast').add((dispatcher: any) => {
        dispatcher.on(
          'attribute:dataId:imageBlock',
          (evt: any, data: any, conversionApi: any) => {
            if (!conversionApi.consumable.consume(data.item, evt.name)) {
              return;
            }

            const viewWriter = conversionApi.writer;
            const figure = conversionApi.mapper.toViewElement(data.item);
            const img = figure.getChild(0);

            if (data.attributeNewValue !== null) {
              viewWriter.setAttribute(
                ATTR_DATA_ID,
                data.attributeNewValue,
                img
              );
            } else {
              viewWriter.removeAttribute(ATTR_DATA_ID, img);
            }
          }
        );
        dispatcher.on(
          'attribute:dataId:imageInline',
          (evt: any, data: any, conversionApi: any) => {
            if (!conversionApi.consumable.consume(data.item, evt.name)) {
              return;
            }

            const viewWriter = conversionApi.writer;
            const span = conversionApi.mapper.toViewElement(data.item);
            const img = span.getChild(0);

            if (data.attributeNewValue !== null) {
              // TODO if I only set data-id to `img`, the content will don't have the `data-id` in `img`.
              // but if I set to the wrapper (span), the content will have. Can't explain now.
              viewWriter.setAttribute(
                ATTR_DATA_ID,
                data.attributeNewValue,
                span
              );
              if (img) {
                // avoid img undefined.
                // set to `img` for query selector easier.
                viewWriter.setAttribute(
                  ATTR_DATA_ID,
                  data.attributeNewValue,
                  img
                );
              }
            } else {
              viewWriter.removeAttribute(ATTR_DATA_ID, span);
              if (img) {
                viewWriter.removeAttribute(ATTR_DATA_ID, img);
              }
            }
          }
        );
      });

      editor.setData(this.modelValue || '');
      this.$editor = editor;
    },

    getData(): Data {
      const content = this.$editor?.getData();
      const images = [];
      for (const img of this.$refs.editor.querySelectorAll(IMG_SELECTOR)) {
        images.push(img.getAttribute(ATTR_DATA_ID));
      }

      return {
        content,
        images,
      };
    },
  },
  beforeCreate() {
    EmojiRepository.getAll()
      .then(data => {
        data.items.forEach((item) => {
          let groupEmojis = emojiGroups.get(item.group);
          if (!groupEmojis) {
            groupEmojis = [];
            emojiGroups.set(item.group, groupEmojis);
          }
          groupEmojis.push({
            key: item.key,
            name: item.name,
            imgUrl: item.url
          });
        });
        this.editorConfig.emoji2.groups = emojiGroups;
        this.isShow = true;
      })
  }
});
</script>

<style scoped>
.c-editor ::v-deep(.ck.ck-content) {
  padding: 1rem;
}

.c-editor ::v-deep(.ck.ck-content > :first-child) {
  margin-top: 0;
}

.c-editor ::v-deep(.ck.ck-content > p, .ck.ck-content > ul, .ck.ck-content > ol, .ck.ck-content > blockquote, .ck.ck-content > pre) {
  margin-bottom: var(--ck-spacing-large);
}
</style>
