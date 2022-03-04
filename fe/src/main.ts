import { createApp } from 'vue';
import App from './App.vue';
import './assets/css/index.css';
import './assets/css/quill.snow.css';
import './assets/css/emoji.css';
import router from './router';

const app = createApp(App);
app.use(router);

app.mount('#app');
