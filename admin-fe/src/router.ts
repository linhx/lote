import { RouteRecordRaw, createRouter, createWebHistory } from 'vue-router';
import NoteCreateView from './views/note/NoteCreateView.vue';
import NotePreviewView from './views/note/NotePreviewView.vue';
import NotesView from './views/note/NotesView.vue';
import NoteUpdateView from './views/note/NoteUpdateView.vue';
import ROUTES_NAME from './constants/routes';
import CommentsView from './views/note/CommentsView.vue';

const routes: RouteRecordRaw[] = [
  { path: '/', name: ROUTES_NAME.NOTES, component: NotesView },
  { path: '/note/create', component: NoteCreateView },
  {
    path: '/note/:id',
    name: ROUTES_NAME.NOTE_UPDATE,
    component: NoteUpdateView,
    props: route => ({ id: route.params.id })
  },
  {
    path: '/note/:id/comment',
    name: ROUTES_NAME.NOTE_COMMENTS,
    component: CommentsView,
    props: route => ({ noteId: route.params.id, noteTitle: route.params.title })
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
