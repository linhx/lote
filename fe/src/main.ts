import { createApp } from 'vue';
import App from './App.vue';
import './assets/css/index.css';
import './assets/css/quill.snow.css';
import './assets/css/emoji.css';
import router from './router';
import PrefetchLink from './components/PrefetchLink.vue';
import CommentsSection from './components/CommentsSection.vue';
import i18n from './i18n';

const app = createApp(App);
app.use(router);
app.component('PrefetchLink', PrefetchLink);
app.component('CommentsSection', CommentsSection);

app.use(i18n);
app.mount('#app');
