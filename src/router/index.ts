import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '../views/LoginView.vue'
import SignUpView from '@/views/SignUpView.vue'
import HomeView from '../views/HomeView.vue'
import { useAuthStore } from '../stores/auth'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/login'
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView
    },
    {
      path: '/signup',
      name: 'signup',
      component: SignUpView
    },
    {
      path: '/home',
      name: 'home',
      component: HomeView,
      // meta: { requiresAuth: true }
    },
    {
      path: '/static',
      name: 'static',
      component: () => import('../views/assess/StaticView.vue'),
      // meta: { requiresAuth: true }
    },
    {
      path: '/exercise',
      name: 'exercise',
      component: () => import('../views/assess/ExerciseView.vue'),
      // meta: { requiresAuth: true }
    },
    {
      path: '/yoga',
      name: 'yoga',
      component: () => import('../views/assess/YogaView.vue'),
      // meta: { requiresAuth: true }
    },
    {
      path: '/user/profile',
      name: 'user-profile',
      component: () => import('../views/user/ProfileView.vue'),
      // meta: { requiresAuth: true }
    },
    {
      path: '/user/report',
      name: 'user-report',
      component: () => import('../views/user/ReportView.vue'),
      // meta: { requiresAuth: true }
    },
  ]
})

router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore();
  if (!authStore.token && to.meta.requiresAuth) {
    next('/login');
  } else {
    if (authStore.token && !authStore.user) {
      await authStore.fetchUser();
    }
    next();
  }
})

export default router
