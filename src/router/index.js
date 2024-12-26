import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('../views/HomeView.vue'),
    },
    {
      path: '/products',
      name: 'products',
      component: () => import('../views/ProductView.vue'),
    },
    {
      path: '/stock',
      name: 'stock',
      component: () => import('../views/StockView.vue'),
    },
    {
      path: '/sales',
      name: 'sales',
      component: () => import('../views/SalesView.vue'),
    },
    {
      path: '/orders',
      name: 'orders',
      component: () => import('../views/OrderView.vue'),
    }
  ],
})

export default router
