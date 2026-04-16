<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { LayoutDashboard, FileText, Image, LogOut, Menu, X } from 'lucide-vue-next'

const router = useRouter()
const auth = useAuthStore()
const sidebarOpen = ref(false)

const navLinks = [
  { href: '/admin', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/admin/portfolio', icon: Image, label: 'Portfolio' },
  { href: '/admin/blog', icon: FileText, label: 'Blog' },
]

onMounted(async () => {
  // Wait for auth to load
  if (auth.loading) {
    await new Promise<void>((resolve) => {
      const check = setInterval(() => {
        if (!auth.loading) {
          clearInterval(check)
          resolve()
        }
      }, 100)
    })
  }

  // Redirect non-admins
  if (!auth.isAdmin) {
    router.push('/')
  }
})
</script>

<template>
  <div style="display: flex; min-height: 100vh; background: var(--bg-secondary)">
    <!-- Mobile Header -->
    <header
      style="
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        height: 3.5rem;
        background: var(--bg-primary);
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        z-index: 30;
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 0 1rem;
      "
      class="mobile-header"
    >
      <h2
        style="
          font-size: 1.25rem;
          font-weight: 700;
          background: linear-gradient(to right, #2563eb, #22d3ee);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        "
      >
        Admin
      </h2>
      <button
        @click="sidebarOpen = true"
        style="
          padding: 0.5rem;
          border: none;
          background: none;
          cursor: pointer;
          color: var(--text-secondary);
          border-radius: 0.5rem;
        "
        aria-label="Open menu"
      >
        <Menu :size="24" />
      </button>
    </header>

    <!-- Mobile Overlay -->
    <div
      v-if="sidebarOpen"
      style="position: fixed; inset: 0; background: rgba(0, 0, 0, 0.5); z-index: 40"
      class="mobile-only"
      @click="sidebarOpen = false"
    />

    <!-- Sidebar -->
    <aside
      :style="{
        position: 'fixed',
        top: 0,
        left: 0,
        height: '100%',
        width: '16rem',
        background: 'var(--bg-primary)',
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
        zIndex: 50,
        transform: sidebarOpen ? 'translateX(0)' : 'translateX(-100%)',
        transition: 'transform 0.3s ease-in-out',
      }"
      class="admin-sidebar"
    >
      <div
        :style="{
          padding: '1.5rem',
          borderBottom: '1px solid var(--border-primary)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }"
      >
        <h2
          style="
            font-size: 1.5rem;
            font-weight: 700;
            background: linear-gradient(to right, #2563eb, #22d3ee);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
          "
        >
          Admin
        </h2>
        <button
          @click="sidebarOpen = false"
          style="
            padding: 0.25rem;
            border: none;
            background: none;
            cursor: pointer;
            color: var(--text-muted);
          "
          class="mobile-only"
          aria-label="Close menu"
        >
          <X :size="20" />
        </button>
      </div>

      <nav style="padding: 1rem">
        <router-link
          v-for="link in navLinks"
          :key="link.href"
          :to="link.href"
          @click="sidebarOpen = false"
          :style="{
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            padding: '0.75rem 1rem',
            color: 'var(--text-secondary)',
            borderRadius: '0.5rem',
            textDecoration: 'none',
            transition: 'background 0.2s',
            marginBottom: '0.5rem',
          }"
        >
          <component :is="link.icon" :size="20" />
          {{ link.label }}
        </router-link>

        <a
          href="/api/auth/logout"
          :style="{
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            padding: '0.75rem 1rem',
            color: '#ef4444',
            borderRadius: '0.5rem',
            textDecoration: 'none',
            transition: 'background 0.2s',
            marginTop: '2rem',
          }"
        >
          <LogOut :size="20" />
          Sign Out
        </a>
      </nav>

      <!-- User info -->
      <div
        v-if="auth.user"
        :style="{
          position: 'absolute',
          bottom: 0,
          width: '100%',
          padding: '1.5rem',
          borderTop: '1px solid var(--border-primary)',
        }"
      >
        <div style="display: flex; align-items: center; gap: 0.75rem">
          <img
            v-if="auth.user.image"
            :src="auth.user.image"
            alt="User"
            style="width: 2.5rem; height: 2.5rem; border-radius: 9999px"
          />
          <div style="overflow: hidden">
            <p
              class="truncate"
              :style="{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-primary)' }"
            >
              {{ auth.user.name }}
            </p>
            <p class="truncate" :style="{ fontSize: '0.75rem', color: 'var(--text-muted)' }">
              {{ auth.user.email }}
            </p>
          </div>
        </div>
      </div>
    </aside>

    <!-- Main Content -->
    <main class="admin-main" style="flex: 1; padding: 2rem">
      <router-view />
    </main>
  </div>
</template>

<style scoped>
@media (min-width: 768px) {
  .mobile-header {
    display: none !important;
  }
  .mobile-only {
    display: none !important;
  }
  .admin-sidebar {
    transform: translateX(0) !important;
    z-index: 20 !important;
  }
  .admin-main {
    margin-left: 16rem;
    padding-top: 2rem !important;
  }
}

@media (max-width: 767px) {
  .admin-main {
    padding-top: 5rem !important;
  }
}
</style>
