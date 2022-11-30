import { createApp } from 'vue';
import { createPinia } from 'pinia'
import App from './App.vue';
import './assets/css/preflight.css';
import './assets/css/fonts.css';
import './assets/css/index.css';
import './assets/css/content-theme.css';
import './assets/css/emoji.css';
import './assets/css/note.css';
import './assets/css/equilibrium-gray-light.min.css';
import './assets/css/onedark.min.css';
import { create as createRouter } from './router';
import CommentsSection from './components/CommentsSection.vue';
import i18n from './i18n';
import { VueLadom } from 'vue-ladom';
import 'vue-ladom/dist/style.css';
import TagLink from './components/TagLink.vue';

const app = createApp(App);
app.use(i18n);
app.use(createPinia());
app.use(VueLadom);
app.component('CommentsSection', CommentsSection);
app.component('TagLink', TagLink);

createRouter().then(router => {
  app.use(router);

  app.mount('body');
});
