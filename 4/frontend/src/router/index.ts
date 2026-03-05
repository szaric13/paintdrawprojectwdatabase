import { createRouter, createWebHistory } from 'vue-router';
import Gallery from '@/views/Gallery.vue';
import Home from '@/views/Home.vue';
import Draw from '@/views/Draw.vue';
import Login from '@/views/Login.vue';
import Register from '@/views/Register.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL), 
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home,
    },
    {
      path: '/gallery',
      name: 'gallery',
      component: Gallery
    },
    {
      path: '/draw',
      name: 'draw',
      component:Draw
    },
    {
      path: '/login',
      name: 'login',
      component: Login
    },
    {
      path: '/register',
      name: 'register',
      component: Register
    },
  ],
});

export default router;
