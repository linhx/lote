import { RouteRecordRaw, createRouter, createWebHistory } from 'vue-router';
import { PATHS_NAME } from '../constants/paths';
import NotesTagView from '../views/NotesTagView.vue';
import NotesView from '../views/NotesView.vue';
import View404 from '../views/404.vue';
import { permalinkToFile } from './preFetch';
import * as InternetUtils from '../utilities/InternetUtils';

export async function create() {
  const noteRoutes: RouteRecordRaw[] = [];

  if (import.meta.env.PROD) {
    for (const noteChunk in __VP_HASH_MAP__) {
      const path = noteChunk;
      const component = permalinkToFile(path);
      if (component) {
        noteRoutes.push({
          path,
          component() {
            return import(/* @vite-ignore */component).catch(async () => {
              const isOnline = await InternetUtils.check();
              if(isOnline) {
                return import(/* @vite-ignore */component + '?v=' + new Date().toISOString());
              }
              alert('Please check your internet connection!');
            });
          },
          props: { permalink: path }
        });
      }
    }
  } else { // development mode
    type Note = {
      [name: string]: any
    }
    const notes = (await import('../../notes')).default;
    console.log('notes', notes)
    for (const note in notes) {
      noteRoutes.push({
        path: '/' + note,
        component: (<Note> notes)[note],
        props: { permalink: note }
      })
    }
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

  return router;
}
