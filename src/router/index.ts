import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import ProjectsView from '@/views/ProjectsView.vue'
import BlogView from '@/views/BlogView.vue'
import BlogDetailView from '@/views/BlogDetailView.vue'
import NowView from '@/views/NowView.vue'
import TerminalView from '@/views/TerminalView.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/projects',
      name: 'projects',
      component: ProjectsView,
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
      path: '/now',
      name: 'now',
      component: NowView,
    },
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
        {
          path: 'about',
          name: 'admin-about',
          component: () => import('@/views/admin/AdminAboutSettings.vue'),
        },
        {
          path: 'status',
          name: 'admin-status',
          component: () => import('@/views/admin/AdminStatusSettings.vue'),
        },
      ],
    },
    {
      path: '/terminal',
      name: 'terminal',
      component: TerminalView,
    },
  ],
  scrollBehavior() {
    return { top: 0 }
  },
})

export default router
