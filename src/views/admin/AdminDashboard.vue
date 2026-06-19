<script setup lang="ts">
import { useAuthStore } from '@/stores/auth'

const auth = useAuthStore()
</script>

<template>
  <div style="display: flex; flex-direction: column; gap: 1.5rem">
    <h1 :style="{ fontSize: '1.875rem', fontWeight: 700, color: 'var(--text-primary)' }">Dashboard</h1>
    <div
      :style="{
        background: 'var(--bg-primary)',
        padding: '1.5rem',
        borderRadius: '0.75rem',
        boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
        border: '1px solid var(--border-primary)',
      }"
    >
      <h2 :style="{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '0.5rem', color: 'var(--text-primary)' }">
        Welcome back, {{ auth.user?.name }}!
      </h2>
      <p :style="{ color: 'var(--text-muted)' }">
        Select an option from the sidebar to manage your portfolio or blog posts.
      </p>
    </div>
  </div>
</template>
