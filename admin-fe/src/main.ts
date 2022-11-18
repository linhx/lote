import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import IdMixin from './mixins/IdMixin';
import i18n from './i18n';
import './assets/css/preflight.css';
import './assets/css/index.css';
import './assets/css/fonts.css';
import './assets/css/editor-theme.css';
import './assets/css/emoji.css';

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    safeId: (suffix: string) => string;
    localId: string;
  }
}

const app = createApp(App);
app.use(router);
app.mixin(IdMixin);
app.use(i18n);
app.mount('#app');
