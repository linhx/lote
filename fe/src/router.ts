import { RouteRecordRaw, createRouter, createWebHistory } from 'vue-router';
import NotesView from './views/NotesView.vue';
import NoteView from './views/NoteView.vue';

const routes: RouteRecordRaw[] = [
  { path: '/', component: NotesView },
  {
    path: '/note/:permalink',
    component: NoteView, 
    props: route => ({ permalink: route.params.permalink })
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
