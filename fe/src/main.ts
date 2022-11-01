import { createApp } from 'vue';
import { createPinia } from 'pinia'
import App from './App.vue';
import './assets/css/preflight.css';
import './assets/css/fonts.css';
import './assets/css/index.css';
import './assets/css/content-theme.css';
import './assets/css/emoji.css';
import './assets/css/note.css';
import { create as createRouter } from './router';
import PrefetchLink from './components/PrefetchLink.vue';
import CommentsSection from './components/CommentsSection.vue';
import i18n from './i18n';
import TagLink from './components/TagLink.vue';

const app = createApp(App);
app.use(i18n);
app.use(createPinia());
app.component('PrefetchLink', PrefetchLink);
app.component('CommentsSection', CommentsSection);
app.component('TagLink', TagLink);

createRouter().then(router => {
  app.use(router);

  app.mount('body');
});
