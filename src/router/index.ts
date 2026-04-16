import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('@/views/HomeView.vue'),
    },
    {
      path: '/about',
      name: 'about',
      component: () => import('@/views/AboutView.vue'),
    },
    {
      path: '/portfolio',
      name: 'portfolio',
      component: () => import('@/views/PortfolioView.vue'),
    },
    {
      path: '/blog',
      name: 'blog',
      component: () => import('@/views/BlogView.vue'),
    },
    {
      path: '/blog/:slug',
      name: 'blog-detail',
      component: () => import('@/views/BlogDetailView.vue'),
    },
    {
      path: '/status',
      name: 'status',
      component: () => import('@/views/StatusView.vue'),
    },
    // Admin routes
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
