import { RouteRecordRaw, createRouter, createWebHistory } from 'vue-router';
import { PATHS_NAME } from '../constants/paths';
import NotesTagView from '../views/NotesTagView.vue';
import NotesView from '../views/NotesView.vue';
import View404 from '../views/404.vue';
import { useStore } from '../stores';
import NoteView from '../views/NoteView.vue';

export async function create() {
  const routes: RouteRecordRaw[] = [
    {
      path: '/',
      name: PATHS_NAME.NOTES,
      component: NotesView,
    },
    {
      path: '/tag/:tag',
      name: PATHS_NAME.NOTES_TAG,
      component: NotesTagView,
      props: (route) => ({ tag: route.params.tag }),
    },
    {
      path: '/note/:permalink',
      name: PATHS_NAME.NOTE,
      component: NoteView,
      props: (route) => ({ permalink: route.params.permalink }),
    },
    {
      path: '/:pathMatch(.*)*',
      name: PATHS_NAME.VIEW_404,
      component: View404,
    },
  ];

  const router = createRouter({
    history: createWebHistory(),
    routes,
  });

  router.beforeEach((to, from, next) => {
    const store = useStore();
    store.setShowButtonBack(
      from.name === PATHS_NAME.NOTES_TAG && to.meta?.page === PATHS_NAME.NOTE
    );
    next();
  });

  return router;
}
