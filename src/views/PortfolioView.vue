<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { Folder, ExternalLink } from 'lucide-vue-next'
import AppFooter from '@/components/AppFooter.vue'

interface PortfolioItem {
  id: string
  title: string
  description: string
  link: string | null
  imageUrl: string | null
  tags: string
  createdAt: string
}

const items = ref<PortfolioItem[]>([])
const loading = ref(true)

function parseTags(tagsStr: string): string[] {
  try {
    const parsed = JSON.parse(tagsStr)
    return Array.isArray(parsed) ? parsed : [tagsStr]
  } catch {
    return [tagsStr]
  }
}

onMounted(async () => {
  try {
    const res = await fetch('/api/portfolio')
    if (res.ok) {
      items.value = await res.json()
    }
  } catch (e) {
    console.error('Failed to fetch portfolio items', e)
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <main class="container-narrow" style="padding: 3rem 1.5rem; position: relative; z-index: 10">
    <!-- Header -->
    <section style="margin-bottom: 3rem">
      <h1
        class="animate-fade-in-up"
        :style="{ fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: 700, marginBottom: '1rem', color: 'var(--text-primary)' }"
      >
        Portfolio
      </h1>
      <p
        class="animate-fade-in-up animation-delay-200"
        :style="{ fontSize: '1.125rem', color: 'var(--text-secondary)' }"
      >
        Koleksi karya dan project yang pernah kukerjakan.
      </p>
    </section>

    <!-- Loading -->
    <div v-if="loading" style="text-align: center; padding: 3rem; color: var(--text-muted)">
      Loading...
    </div>

    <!-- Projects Grid -->
    <section v-else class="portfolio-grid">
      <a
        v-for="(project, index) in items"
        :key="project.id"
        :href="project.link || '#'"
        :target="project.link ? '_blank' : undefined"
        rel="noopener noreferrer"
        class="animate-fade-in-up"
        :style="{
          display: 'block',
          padding: '1.5rem',
          borderRadius: '0.75rem',
          transition: 'all 0.3s',
          background: 'var(--bg-card)',
          border: '1px solid var(--border-primary)',
          textDecoration: 'none',
          animationDelay: `${index * 100 + 200}ms`,
        }"
      >
        <div
          :style="{
            width: '2.5rem',
            height: '2.5rem',
            borderRadius: '0.5rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '1rem',
            background: 'var(--badge-bg)',
          }"
        >
          <Folder :size="20" :style="{ color: 'var(--text-accent)' }" />
        </div>
        <h3
          :style="{
            fontSize: '1.25rem',
            fontWeight: 600,
            marginBottom: '0.5rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            color: 'var(--text-primary)',
          }"
        >
          {{ project.title }}
          <ExternalLink v-if="project.link" :size="16" :style="{ opacity: 0.5 }" />
        </h3>
        <p
          class="line-clamp-3"
          :style="{ fontSize: '0.875rem', marginBottom: '1rem', color: 'var(--text-muted)' }"
        >
          {{ project.description }}
        </p>
        <div style="display: flex; flex-wrap: wrap; gap: 0.5rem">
          <span
            v-for="(tag, i) in parseTags(project.tags)"
            :key="i"
            :style="{
              padding: '0.25rem 0.5rem',
              fontSize: '0.75rem',
              borderRadius: '9999px',
              background: 'var(--badge-bg)',
              color: 'var(--badge-text)',
            }"
          >
            {{ tag }}
          </span>
        </div>
      </a>

      <div v-if="items.length === 0" style="grid-column: 1 / -1; text-align: center; padding: 3rem; color: var(--text-muted)">
        No projects found. Check back later!
      </div>
    </section>

    <div style="margin-top: 3rem">
      <AppFooter />
    </div>
  </main>
</template>

<style scoped>
.portfolio-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;
}
@media (min-width: 768px) {
  .portfolio-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>
