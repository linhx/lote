import { RouteRecordRaw, createRouter, createWebHistory } from 'vue-router';
import { PATHS_NAME } from '../constants/paths';
import NotesTagView from '../views/NotesTagView.vue';
import NotesView from '../views/NotesView.vue';
import View404 from '../views/404.vue';
import { permalinkToFile } from './preFetch';

const noteRoutes: RouteRecordRaw[] = []

if (import.meta.env.PROD) {
  for (const noteChunk in __VP_HASH_MAP__) {
    const path = noteChunk;
    const component = permalinkToFile(path);
    if (component) {
      noteRoutes.push({
        path,
        component() {
          return import(component).catch(() => {
            if(navigator.onLine) {
              return import(component + '?v=' + new Date().toISOString());
            }
            alert('Please check your internet connection!');
          });
        },
        props: { permalink: path }
      });
    }
  }
} else {
  // TODO development mode
}

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: PATHS_NAME.NOTES,
    component: NotesView
  },
  ...noteRoutes,
  {
    path: '/tag/:tag',
    name: PATHS_NAME.NOTES_TAG,
    component: NotesTagView,
    props: route => ({ tag: route.params.tag }),
  },
  {
    path: '/:pathMatch(.*)*',
    component: View404
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
