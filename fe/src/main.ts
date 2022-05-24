import { createApp } from 'vue';
import { createPinia } from 'pinia'
import App from './App.vue';
import './assets/css/index.css';
import './assets/css/quill.snow.css';
import './assets/css/emoji.css';
import { create as createRouter } from './router';
import PrefetchLink from './components/PrefetchLink.vue';
import CommentsSection from './components/CommentsSection.vue';
import i18n from './i18n';
import TagLink from './components/TagLink.vue';


createRouter().then(router => {
  const app = createApp(App);
  app.use(router);
  app.use(createPinia());
  app.component('PrefetchLink', PrefetchLink);
  app.component('CommentsSection', CommentsSection);
  app.component('TagLink', TagLink);
  
  app.use(i18n);
  app.mount('#app');
});
