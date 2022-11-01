/// <reference types="vite/client" />

declare module '*.vue' {
  import { DefineComponent } from 'vue'
  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/ban-types
  const component: DefineComponent<{}, {}, any>
  export default component
}

interface ImportMetaEnv {
  readonly VITE_APP_API_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

declare module 'quill-blot-formatter/dist/BlotFormatter';

declare module 'quill-emoji';

declare module '@ckeditor/ckeditor5-vue';
declare module '@linhx/ckeditor5-build';
declare module '@ckeditor/ckeditor5-editor-classic/src/classiceditor';