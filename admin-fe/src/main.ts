import { createApp } from 'vue';
import App from './App.vue';
import './assets/css/index.css';
import 'quill/dist/quill.snow.css';
import router from './router';
import IdMixin from './mixins/IdMixin';

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    safeId: (suffix: string) => string
    localId: string
  }
}

const app = createApp(App);
app.use(router);
app.mixin(IdMixin)
app.mount('#app');
