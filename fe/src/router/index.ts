import { RouteRecordRaw, createRouter, createWebHistory } from 'vue-router';
import NotesView from '../views/NotesView.vue';
import V404View from '../views/404.vue';
import { pathToFile } from './preFetch';

let noteComp: string | undefined = '';
const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'NotesView',
    component: NotesView,
    children: [
      {
        path: '/:permalink',
        beforeEnter: (to, from) => {
          noteComp = pathToFile(to.path);
        },
        component: () => {
          if (noteComp) {
            const _noteComp = noteComp;
            noteComp = '';
            return import(_noteComp);
          } else {
            return Promise.resolve(V404View);
          }
        }, 
        props: route => ({ permalink: route.params.permalink })
      }
    ]
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
