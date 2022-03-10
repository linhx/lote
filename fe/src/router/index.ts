import { RouteRecordRaw, createRouter, createWebHistory } from 'vue-router';
import NotesView from '../views/NotesView.vue';
import { permalinkToFile } from './preFetch';

const noteRoutes: RouteRecordRaw[] = []
for (const noteChunk in __VP_HASH_MAP__) {
  const path = noteChunk.substring(5);
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
