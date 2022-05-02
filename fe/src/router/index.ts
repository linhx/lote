import { RouteRecordRaw, createRouter, createWebHistory } from 'vue-router';
import NotesView from '../views/NotesView.vue';
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
        }
      });
    }
  }
} else {
  // TODO development mode
}

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'NotesView',
    component: NotesView,
    children: noteRoutes
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
