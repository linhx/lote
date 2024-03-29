import { RouteRecordRaw, createRouter, createWebHistory } from 'vue-router';
import NoteCreateView from './views/note/NoteCreateView.vue';
import NotePreviewView from './views/note/NotePreviewView.vue';
import NotesView from './views/note/NotesView.vue';
import NoteUpdateView from './views/note/NoteUpdateView.vue';
import ROUTES_NAME from './constants/routes';
import CommentsView from './views/note/CommentsView.vue';
import TodayILearnedsView from './views/today-i-learned/TodayILearnedsView.vue';
import TodayILearnedCreateView from './views/today-i-learned/TodayILearnedCreateView.vue';
import TodayILearnedUpdateView from './views/today-i-learned/TodayILearnedUpdateView.vue';
import TodayILearnedPreviewView from './views/today-i-learned/TodayILearnedPreviewView.vue';
import EmojisView from './views/emoji/EmojisView.vue';
import EmojiCreateView from './views/emoji/EmojiCreateView.vue';
import EmojiUpdateView from './views/emoji/EmojiUpdateView.vue';
import EmojiImportView from './views/emoji/EmojiImportView.vue';

const routes: RouteRecordRaw[] = [
  { path: '/', component: NotesView },
  { path: '/note', name: ROUTES_NAME.NOTES, component: NotesView },
  {
    path: '/note/create',
    name: ROUTES_NAME.NOTE_CREATE,
    component: NoteCreateView,
  },
  {
    path: '/note/:id',
    name: ROUTES_NAME.NOTE_UPDATE,
    component: NoteUpdateView,
    props: (route) => ({ id: route.params.id }),
  },
  {
    path: '/note/:id/comment',
    name: ROUTES_NAME.NOTE_COMMENTS,
    component: CommentsView,
    props: (route) => ({ noteId: route.params.id }),
  },
  {
    path: '/note/:id/preview',
    component: NotePreviewView,
    props: (route) => ({ id: route.params.id }),
  },

  {
    path: '/today-i-learned',
    name: ROUTES_NAME.TODAY_I_LEARNEDS,
    component: TodayILearnedsView,
  },
  {
    path: '/today-i-learned/create',
    name: ROUTES_NAME.TODAY_I_LEARNED_CREATE,
    component: TodayILearnedCreateView,
  },
  {
    path: '/today-i-learned/:id',
    name: ROUTES_NAME.TODAY_I_LEARNED_UPDATE,
    component: TodayILearnedUpdateView,
    props: (route) => ({ id: route.params.id }),
  },
  {
    path: '/today-i-learned/:id/preview',
    component: TodayILearnedPreviewView,
    props: (route) => ({ id: route.params.id }),
  },

  { path: '/emoji', name: ROUTES_NAME.EMOJIS, component: EmojisView },
  {
    path: '/emoji/create',
    name: ROUTES_NAME.EMOJI_CREATE,
    component: EmojiCreateView,
  },
  {
    path: '/emoji/import',
    name: ROUTES_NAME.EMOJI_IMPORT,
    component: EmojiImportView,
  },
  {
    path: '/emoji/:id',
    name: ROUTES_NAME.EMOJI_UPDATE,
    component: EmojiUpdateView,
    props: (route) => ({ id: route.params.id }),
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
