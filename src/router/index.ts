import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import AboutView from '@/views/AboutView.vue'
import PortfolioView from '@/views/PortfolioView.vue'
import BlogView from '@/views/BlogView.vue'
import BlogDetailView from '@/views/BlogDetailView.vue'
import StatusView from '@/views/StatusView.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/about',
      name: 'about',
      component: AboutView,
    },
    {
      path: '/portfolio',
      name: 'portfolio',
      component: PortfolioView,
    },
    {
      path: '/blog',
      name: 'blog',
      component: BlogView,
    },
    {
      path: '/blog/:slug',
      name: 'blog-detail',
      component: BlogDetailView,
    },
    {
      path: '/status',
      name: 'status',
      component: StatusView,
    },
    // Admin routes (lazy-loaded — rarely visited)
    {
      path: '/admin',
      component: () => import('@/views/admin/AdminLayout.vue'),
      children: [
        {
          path: '',
          name: 'admin-dashboard',
          component: () => import('@/views/admin/AdminDashboard.vue'),
        },
        {
          path: 'portfolio',
          name: 'admin-portfolio',
          component: () => import('@/views/admin/AdminPortfolio.vue'),
        },
        {
          path: 'portfolio/new',
          name: 'admin-portfolio-new',
          component: () => import('@/views/admin/AdminPortfolioForm.vue'),
        },
        {
          path: 'portfolio/:id',
          name: 'admin-portfolio-edit',
          component: () => import('@/views/admin/AdminPortfolioForm.vue'),
        },
        {
          path: 'blog',
          name: 'admin-blog',
          component: () => import('@/views/admin/AdminBlog.vue'),
        },
        {
          path: 'blog/new',
          name: 'admin-blog-new',
          component: () => import('@/views/admin/AdminBlogForm.vue'),
        },
        {
          path: 'blog/:slug',
          name: 'admin-blog-edit',
          component: () => import('@/views/admin/AdminBlogForm.vue'),
        },
      ],
    },
  ],
  scrollBehavior() {
    return { top: 0 }
  },
})

export default router

