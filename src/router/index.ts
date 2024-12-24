import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/level/:id',
      name: 'level',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/LevelView.vue'),
    },
    {
      path: '/story/:id',
      name: 'story',
      component: () => import('../views/StoryView.vue'),
    },
    {
      path: '/level:levelNumber/task:taskNumber/',
      name: 'task',
      component: () => import('../views/TaskView.vue'),
    },
  ],
})

export default router
