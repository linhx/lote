import { RouteRecordRaw, createRouter, createWebHistory } from 'vue-router';
import { PATHS_NAME } from '../constants/paths';
import NotesTagView from '../views/NotesTagView.vue';
import NotesView from '../views/NotesView.vue';
import NoteView from '../views/NoteView.vue';
import TodayILearnedsView from '../views/TodayILearnedsView.vue';
import TodayILearnedView from '../views/TodayILearnedView.vue';
import TodayILearnedsTagView from '../views/TodayILearnedsTagView.vue';
import View404 from '../views/404.vue';

const BREADCRUMBS = {
  HOME: { label: '/home', path: '/' },
  TIL: { label: '/today-i-learned', path: '/today-i-learned' },
}

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
      meta: {
        breadcrumbs: [BREADCRUMBS.HOME],
      },
    },
    {
      path: '/note/:permalink',
      name: PATHS_NAME.NOTE,
      component: NoteView,
      props: (route) => ({ permalink: route.params.permalink, v: history.state.v }),
      beforeEnter(to, from, next) {
        if (from.name === PATHS_NAME.NOTES_TAG) {
          to.meta.breadcrumbs = [BREADCRUMBS.HOME, { label: '/tag', path: `/tag/${from.params.tag}` }];
        } else {
          to.meta.breadcrumbs = [BREADCRUMBS.HOME];
        }
        next();
      },
    },
    {
      path: '/today-i-learned',
      name: PATHS_NAME.TODAY_I_LEARNEDS,
      component: TodayILearnedsView,
      meta: {
        breadcrumbs: [BREADCRUMBS.HOME],
      },
    },
    {
      path: '/today-i-learned/tag/:tag',
      name: PATHS_NAME.TODAY_I_LEARNEDS_TAG,
      component: TodayILearnedsTagView,
      props: (route) => ({ tag: route.params.tag }),
      meta: {
        breadcrumbs: [BREADCRUMBS.HOME, BREADCRUMBS.TIL],
      },
    },
    {
      path: '/today-i-learned/:permalink',
      name: PATHS_NAME.TODAY_I_LEARNED,
      component: TodayILearnedView,
      props: (route) => ({ permalink: route.params.permalink, v: history.state.v }),
      beforeEnter(to, from, next) {
        if (from.name === PATHS_NAME.TODAY_I_LEARNEDS_TAG) {
          to.meta.breadcrumbs = [BREADCRUMBS.HOME, BREADCRUMBS.TIL, { label: '/tag', path: `/today-i-learned/tag/${from.params.tag}` }]
        } else {
          to.meta.breadcrumbs = [BREADCRUMBS.HOME, BREADCRUMBS.TIL];
        }
        next();
      },
    },
    {
      path: '/:pathMatch(.*)*',
      name: PATHS_NAME.VIEW_404,
      component: View404,
      meta: {
        breadcrumbs: [BREADCRUMBS.HOME]
      },
    },
  ];

  const router = createRouter({
    history: createWebHistory(),
    routes,
  });

  return router;
}
