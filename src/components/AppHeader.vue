<script setup lang="ts">
import { ref } from 'vue'
import { useRoute } from 'vue-router'
import { navLinks } from '@/config/navigation'
import { Menu, X, Disc3, Sun, Moon } from 'lucide-vue-next'
import { useThemeStore } from '@/stores/theme'
import NowPlaying from '@/components/NowPlaying.vue'

defineProps<{
  nowPlayingVisible: boolean
  lastfmUsername: string
  lastfmApiKey: string
}>()

const emit = defineEmits<{
  'toggle-now-playing': []
}>()

const themeStore = useThemeStore()
const route = useRoute()
const mobileOpen = ref(false)

function closeMobile() {
  mobileOpen.value = false
}
</script>

<template>
  <!-- Mobile top bar -->
  <header class="mobile-header">
    <router-link to="/" class="mobile-brand">w0pal</router-link>
    <button
      class="hamburger"
      @click="mobileOpen = !mobileOpen"
      aria-label="Toggle navigation"
    >
      <Menu v-if="!mobileOpen" :size="18" />
      <X v-else :size="18" />
    </button>
  </header>

  <!-- Mobile overlay -->
  <transition name="fade">
    <div
      v-if="mobileOpen"
      class="mobile-overlay"
      @click="closeMobile"
    />
  </transition>

  <!-- Sidebar (desktop + mobile slide-in) -->
  <aside
    class="sidebar"
    :class="{ open: mobileOpen }"
  >
    <div class="sidebar-inner">
      <router-link to="/" class="sidebar-brand">w0pal</router-link>
      <nav class="sidebar-nav">
        <router-link
          v-for="link in navLinks"
          :key="link.href"
          :to="link.href"
          class="nav-item"
          :class="{ active: route.path === link.href }"
          @click="closeMobile"
        >
          {{ link.label }}
        </router-link>
      </nav>
      <div class="sidebar-footer">
        <button
          class="theme-toggle"
          @click="themeStore.toggle"
          aria-label="Toggle theme"
        >
          <Sun v-if="!themeStore.isDarkMode" :size="14" />
          <Moon v-else :size="14" />
          <span>{{ themeStore.isDarkMode ? 'Dark' : 'Light' }}</span>
        </button>
        <button
          class="now-playing-toggle"
          :class="{ active: nowPlayingVisible }"
          @click="emit('toggle-now-playing')"
          aria-label="Toggle now playing"
        >
          <Disc3 :size="14" />
          <span>Now Playing</span>
        </button>
        <NowPlaying
          v-if="nowPlayingVisible"
          :username="lastfmUsername"
          :api-key="lastfmApiKey"
        />
      </div>
    </div>
  </aside>
</template>

<style scoped>
/* ===== Mobile top bar ===== */
.mobile-header {
  position: sticky;
  top: 0;
  z-index: 50;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 1.25rem;
  height: 3.25rem;
  background-color: var(--bg-header);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border-bottom: 1px solid var(--border-subtle);
}

.mobile-brand {
  font-size: 1rem;
  font-weight: 700;
  color: var(--text-primary);
}

.hamburger {
  background: none;
  border: none;
  color: var(--text-primary);
  cursor: pointer;
  padding: 0.375rem;
}

/* ===== Mobile overlay ===== */
.mobile-overlay {
  position: fixed;
  inset: 0;
  z-index: 40;
  background: rgba(0, 0, 0, 0.5);
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* ===== Sidebar ===== */
.sidebar {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 50;
  width: 14rem;
  height: 100vh;
  background: var(--bg-primary);
  border-right: 1px solid var(--border-subtle);
  display: flex;
  flex-direction: column;
  transform: translateX(-100%);
  transition: transform 0.25s ease-out;
}

/* Desktop: always visible, hide mobile elements */
@media (min-width: 768px) {
  .sidebar {
    transform: translateX(0);
  }

  .mobile-header,
  .mobile-overlay {
    display: none;
  }
}
/* Mobile: full-width sidebar when open */
@media (max-width: 767px) {
  .sidebar.open {
    width: 100%;
  }
}

/* Mobile: slide in when open */
.sidebar.open {
  transform: translateX(0);
}

.sidebar-inner {
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 2rem 1.5rem;
  overflow-y: auto;
}

.sidebar-brand {
  font-size: 1rem;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 2.5rem;
  display: inline-block;
}

.sidebar-nav {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.nav-item {
  font-size: 0.875rem;
  color: var(--text-muted);
  padding: 0.5rem 0;
  transition: color 0.15s;
}

.nav-item:hover {
  color: var(--text-primary);
}

.nav-item.active {
  color: var(--accent);
}

/* ===== Sidebar footer ===== */
.sidebar-footer {
  margin-top: auto;
  padding-top: 1rem;
  border-top: 1px solid var(--border-subtle);
}

.theme-toggle,
.now-playing-toggle {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  width: 100%;
  padding: 0.5rem 0;
  background: none;
  border: none;
  color: var(--text-muted);
  font-size: 0.875rem;
  font-family: var(--font-mono);
  cursor: pointer;
  transition: color 0.15s;
}

.theme-toggle:hover,
.now-playing-toggle:hover {
  color: var(--text-primary);
}

.now-playing-toggle.active {
  color: var(--accent);
}

/* Mobile: compact layout */
@media (max-width: 767px) {
  .sidebar-inner {
    padding: 1rem 1.25rem;
  }

  .sidebar-brand {
    margin-bottom: 1rem;
    font-size: 0.875rem;
  }

  .nav-item {
    padding: 0.25rem 0;
    font-size: 0.8125rem;
  }

  .sidebar-footer {
    padding-top: 0.5rem;
  }

  .theme-toggle,
  .now-playing-toggle {
    padding: 0.25rem 0;
    font-size: 0.8125rem;
  }
}
</style>
