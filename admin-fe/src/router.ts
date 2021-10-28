import { RouteRecordRaw, createRouter, createWebHistory } from 'vue-router';
import Home from './components/Home.vue';

const routes: RouteRecordRaw[] = [
  { path: '/', component: Home }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
