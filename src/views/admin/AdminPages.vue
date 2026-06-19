<script setup lang="ts">
import { ChevronRight } from 'lucide-vue-next'

const pages = [
  { slug: 'about', title: 'About Page', description: 'Edit the about me text and interests list' },
  { slug: 'status', title: 'Status Page', description: 'Edit your current goals and interests' }
]
</script>

<template>
  <div class="animate-fade-in-up">
    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem">
      <h1 :style="{ fontSize: '1.875rem', fontWeight: 700, color: 'var(--text-primary)' }">
        Pages Content
      </h1>
    </div>

    <div style="display: flex; flex-direction: column; gap: 1rem">
      <router-link
        v-for="page in pages"
        :key="page.slug"
        :to="'/admin/pages/' + page.slug"
        :style="{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '1.5rem',
          background: 'var(--bg-card)',
          borderRadius: '0.75rem',
          border: '1px solid var(--border-primary)',
          textDecoration: 'none',
          transition: 'border-color 0.2s',
        }"
        class="hover-border"
      >
        <div>
          <h2 :style="{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.25rem' }">
            {{ page.title }}
          </h2>
          <p :style="{ color: 'var(--text-muted)', fontSize: '0.875rem' }">
            {{ page.description }}
          </p>
        </div>
        <ChevronRight :style="{ color: 'var(--text-muted)' }" />
      </router-link>
    </div>
  </div>
</template>

<style scoped>
.hover-border:hover {
  border-color: var(--text-accent) !important;
}
</style>
