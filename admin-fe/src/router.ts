import { RouteRecordRaw, createRouter, createWebHistory } from 'vue-router';
import NoteCreateView from './views/note/NoteCreateView.vue';
import NotePreviewView from './views/note/NotePreviewView.vue';
import NotesView from './views/note/NotesView.vue';
import NoteUpdateView from './views/note/NoteUpdateView.vue';

const routes: RouteRecordRaw[] = [
  { path: '/', component: NotesView },
  { path: '/note/create', component: NoteCreateView },
  {
    path: '/note/:id',
    component: NoteUpdateView,
    props: route => ({ id: route.params.id })
  },
  {
    path: '/note/:id/preview',
    component: NotePreviewView,
    props: route => ({ id: route.params.id })
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
