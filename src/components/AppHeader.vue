<script setup lang="ts">
import { computed, ref, onMounted, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'
import { Sun, Moon, Monitor, User, LogOut } from 'lucide-vue-next'
import { useThemeStore } from '@/stores/theme'
import { useAuthStore } from '@/stores/auth'
import { navLinks } from '@/config/navigation'

defineProps<{
  isMenuOpen: boolean
}>()

const emit = defineEmits<{
  toggleMenu: []
}>()

const route = useRoute()
const theme = useThemeStore()
const auth = useAuthStore()

const userMenuOpen = ref(false)
const menuRef = ref<HTMLDivElement | null>(null)

function handleClickOutside(e: MouseEvent) {
  if (menuRef.value && !menuRef.value.contains(e.target as Node)) {
    userMenuOpen.value = false
  }
}

onMounted(() => {
  document.addEventListener('mousedown', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('mousedown', handleClickOutside)
})
</script>

<template>
  <header
    class="animate-fade-in"
    :style="{
      position: 'sticky',
      top: 0,
      zIndex: 50,
      backgroundColor: 'var(--bg-header)',
      borderBottom: '1px solid var(--border-primary)',
      backdropFilter: 'blur(12px)',
      WebkitBackdropFilter: 'blur(12px)',
    }"
  >
    <div
      style="
        width: 100%;
        max-width: 80rem;
        margin: 0 auto;
        padding: 0.75rem 1.5rem;
        display: flex;
        align-items: center;
        justify-content: space-between;
      "
    >
      <!-- Left: User Menu -->
      <div ref="menuRef" style="position: relative">
        <!-- Loading -->
        <div
          v-if="auth.loading"
          style="
            width: 2rem;
            height: 2rem;
            border-radius: 9999px;
            background: var(--badge-bg);
          "
        />

        <!-- Unauthenticated -->
        <button
          v-else-if="!auth.isAuthenticated"
          @click="auth.signIn()"
          style="
            padding: 0.5rem 1rem;
            border-radius: 0.5rem;
            font-size: 0.875rem;
            font-weight: 500;
            border: none;
            cursor: pointer;
            background: var(--badge-bg);
            color: var(--text-primary);
            transition: background 0.2s;
          "
        >
          Sign In
        </button>

        <!-- Authenticated -->
        <template v-else>
          <button
            @click="userMenuOpen = !userMenuOpen"
            style="
              display: block;
              border: none;
              background: none;
              cursor: pointer;
              padding: 0;
              transition: opacity 0.2s;
            "
            aria-label="User menu"
          >
            <img
              v-if="auth.user?.image"
              :src="auth.user.image"
              :alt="auth.user.name || 'User'"
              style="
                width: 2rem;
                height: 2rem;
                border-radius: 9999px;
                border: 1px solid var(--border-primary);
                object-fit: cover;
              "
            />
            <div
              v-else
              style="
                width: 2rem;
                height: 2rem;
                border-radius: 9999px;
                display: flex;
                align-items: center;
                justify-content: center;
                border: 1px solid var(--border-primary);
                background: var(--badge-bg);
                color: var(--text-muted);
              "
            >
              <User :size="16" />
            </div>
          </button>

          <!-- User dropdown -->
          <div
            v-if="userMenuOpen"
            class="animate-fade-in-up"
            style="
              position: absolute;
              left: 0;
              top: 100%;
              margin-top: 0.5rem;
              width: 18rem;
              max-width: 90vw;
              border-radius: 0.75rem;
              box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
              border: 1px solid var(--border-primary);
              background: var(--bg-primary);
              overflow: hidden;
              z-index: 50;
            "
          >
            <div style="padding: 1rem; border-bottom: 1px solid var(--border-secondary)">
              <p
                style="
                  font-size: 0.875rem;
                  font-weight: 600;
                  color: var(--text-primary);
                  overflow: hidden;
                  text-overflow: ellipsis;
                  white-space: nowrap;
                "
              >
                {{ auth.user?.name }}
              </p>
              <p
                style="
                  font-size: 0.75rem;
                  color: var(--text-muted);
                  overflow: hidden;
                  text-overflow: ellipsis;
                  white-space: nowrap;
                "
              >
                {{ auth.user?.email }}
              </p>
            </div>
            <div style="padding: 0.5rem">
              <div
                style="
                  padding: 0.375rem 0.5rem;
                  font-size: 0.75rem;
                  border-radius: 0.5rem;
                  display: flex;
                  justify-content: space-between;
                  align-items: center;
                  background: var(--bg-card);
                  color: var(--text-secondary);
                  margin-bottom: 0.25rem;
                "
              >
                <span>Provider</span>
                <span style="font-weight: 500">{{ auth.provider }}</span>
              </div>
              <div
                style="
                  padding: 0.375rem 0.5rem;
                  font-size: 0.75rem;
                  border-radius: 0.5rem;
                  display: flex;
                  justify-content: space-between;
                  align-items: center;
                  background: var(--bg-card);
                  color: var(--text-secondary);
                "
              >
                <span>Role</span>
                <span :style="{ fontWeight: 500, color: auth.isAdmin ? '#eab308' : 'inherit' }">
                  {{ auth.isAdmin ? 'Admin' : 'User' }}
                </span>
              </div>
            </div>
            <div style="padding: 0.5rem; border-top: 1px solid var(--border-secondary)">
              <button
                @click="auth.signOut()"
                style="
                  width: 100%;
                  display: flex;
                  align-items: center;
                  gap: 0.5rem;
                  padding: 0.5rem;
                  font-size: 0.875rem;
                  border-radius: 0.5rem;
                  border: none;
                  background: none;
                  color: #ef4444;
                  cursor: pointer;
                  transition: background 0.2s;
                "
              >
                <LogOut :size="16" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        </template>
      </div>

      <!-- Desktop Navigation -->
      <nav style="display: none; align-items: center; gap: 0.25rem" class="desktop-nav">
        <router-link
          v-for="link in navLinks"
          :key="link.href"
          :to="link.href"
          style="
            padding: 0.5rem 1rem;
            border-radius: 0.5rem;
            font-size: 0.875rem;
            font-weight: 500;
            transition: color 0.2s;
            text-decoration: none;
          "
          :style="{
            color:
              route.path === link.href ? 'var(--text-primary)' : 'var(--text-muted)',
          }"
        >
          {{ link.label }}
        </router-link>
      </nav>

      <!-- Right Side Controls -->
      <div style="display: flex; align-items: center; gap: 0.5rem">
        <!-- Theme Toggle -->
        <button
          @click="theme.cycleTheme()"
          style="
            padding: 0.5rem;
            border-radius: 0.5rem;
            border: none;
            background: none;
            cursor: pointer;
            color: var(--text-muted);
            transition: color 0.2s, background 0.2s;
          "
          aria-label="Toggle theme"
          :title="`Current: ${theme.themeMode.charAt(0).toUpperCase() + theme.themeMode.slice(1)}`"
        >
          <Sun v-if="theme.themeMode === 'light'" :size="18" />
          <Moon v-else-if="theme.themeMode === 'dark'" :size="18" />
          <Monitor v-else :size="18" />
        </button>

        <!-- Mobile Menu Button -->
        <button
          @click="emit('toggleMenu')"
          class="mobile-menu-btn"
          style="
            padding: 0.5rem;
            border-radius: 0.5rem;
            border: none;
            background: none;
            cursor: pointer;
            color: var(--text-secondary);
            transition: color 0.2s, background 0.2s;
            display: flex;
          "
          aria-label="Toggle menu"
        >
          <div
            style="
              width: 1.25rem;
              height: 1.25rem;
              display: flex;
              flex-direction: column;
              justify-content: center;
              align-items: center;
            "
          >
            <span
              style="
                display: block;
                height: 2px;
                width: 1.25rem;
                border-radius: 1px;
                background: var(--text-secondary);
                transition: all 0.3s ease-in-out;
              "
              :style="{
                transform: isMenuOpen ? 'rotate(45deg) translateY(6px)' : 'none',
              }"
            />
            <span
              style="
                display: block;
                height: 2px;
                width: 1.25rem;
                border-radius: 1px;
                background: var(--text-secondary);
                margin: 4px 0;
                transition: all 0.3s ease-in-out;
              "
              :style="{ opacity: isMenuOpen ? 0 : 1 }"
            />
            <span
              style="
                display: block;
                height: 2px;
                width: 1.25rem;
                border-radius: 1px;
                background: var(--text-secondary);
                transition: all 0.3s ease-in-out;
              "
              :style="{
                transform: isMenuOpen ? 'rotate(-45deg) translateY(-6px)' : 'none',
              }"
            />
          </div>
        </button>
      </div>
    </div>
  </header>
</template>

<style scoped>
@media (min-width: 768px) {
  .desktop-nav {
    display: flex !important;
  }
  .mobile-menu-btn {
    display: none !important;
  }
}
</style>
