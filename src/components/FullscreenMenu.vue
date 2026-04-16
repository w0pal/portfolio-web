<script setup lang="ts">
import { useRoute } from 'vue-router'
import { X } from 'lucide-vue-next'
import { useThemeStore } from '@/stores/theme'
import { navLinks } from '@/config/navigation'

defineProps<{
  isOpen: boolean
}>()

const emit = defineEmits<{
  close: []
}>()

const route = useRoute()
const theme = useThemeStore()
</script>

<template>
  <!-- Backdrop -->
  <div
    :style="{
      position: 'fixed',
      inset: 0,
      zIndex: 40,
      transition: 'opacity 0.3s',
      opacity: isOpen ? 1 : 0,
      pointerEvents: isOpen ? 'auto' : 'none',
      background: 'rgba(0, 0, 0, 0.5)',
      backdropFilter: 'blur(4px)',
      WebkitBackdropFilter: 'blur(4px)',
    }"
    @click="emit('close')"
  />

  <!-- Slide-in Menu -->
  <div
    :style="{
      position: 'fixed',
      top: 0,
      right: 0,
      height: '100%',
      width: '280px',
      zIndex: 50,
      transition: 'transform 0.3s ease-out',
      transform: isOpen ? 'translateX(0)' : 'translateX(100%)',
      background: 'var(--bg-primary)',
      borderLeft: '1px solid var(--border-primary)',
    }"
  >
    <!-- Header -->
    <div
      :style="{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '1rem 1.5rem',
        borderBottom: '1px solid var(--border-primary)',
      }"
    >
      <span
        :style="{
          fontSize: '1.125rem',
          fontWeight: 600,
          color: 'var(--text-primary)',
        }"
      >
        Menu
      </span>
      <button
        @click="emit('close')"
        :style="{
          padding: '0.5rem',
          borderRadius: '0.5rem',
          border: 'none',
          background: 'none',
          cursor: 'pointer',
          color: 'var(--text-muted)',
          transition: 'color 0.2s',
        }"
        aria-label="Close menu"
      >
        <X :size="20" />
      </button>
    </div>

    <!-- Navigation Links -->
    <nav style="padding: 1.5rem 1rem">
      <router-link
        v-for="link in navLinks"
        :key="link.href"
        :to="link.href"
        @click="emit('close')"
        :style="{
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          padding: '0.75rem 1rem',
          borderRadius: '0.75rem',
          transition: 'all 0.2s',
          textDecoration: 'none',
          marginBottom: '0.5rem',
          color:
            route.path === link.href
              ? 'var(--text-primary)'
              : 'var(--text-muted)',
          background:
            route.path === link.href
              ? 'var(--bg-card)'
              : 'transparent',
        }"
      >
        <component :is="link.icon" :size="20" />
        <span style="font-weight: 500">{{ link.label }}</span>
      </router-link>
    </nav>
  </div>
</template>
