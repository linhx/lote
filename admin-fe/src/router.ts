import { RouteRecordRaw, createRouter, createWebHistory } from 'vue-router';
import Home from './components/Home.vue';
import NoteCreate from './views/note/NoteCreate.vue';

const routes: RouteRecordRaw[] = [
  { path: '/', component: Home },
  { path: '/note/create', component: NoteCreate }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
