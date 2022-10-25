import { createApp } from 'vue';
import App from './App.vue';
import './assets/css/index.css';
import router from './router';
import IdMixin from './mixins/IdMixin';
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
app.mount('#app');
