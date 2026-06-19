<script setup lang="ts">
import { ExternalLink } from 'lucide-vue-next'
import { usePortfolio } from '@/composables/usePortfolio'

const { items } = usePortfolio()
</script>

<template>
  <main class="container page">
    <h1 class="page-title">Projects</h1>
    <p class="page-subtitle">Things I've built and worked on.</p>

    <div v-if="items.length === 0" class="empty-state">
      Nothing here yet. Check back later.
    </div>

    <div v-else class="project-list">
      <article
        v-for="project in items"
        :key="project.id"
        class="project-item"
      >
        <a
          v-if="project.imageUrl"
          :href="project.link || '#'"
          target="_blank"
          rel="noopener noreferrer"
          class="project-screenshot-link"
        >
          <img
            :src="project.imageUrl"
            :alt="`${project.title} screenshot`"
            class="project-screenshot"
            loading="lazy"
          />
        </a>
        <div class="project-body">
          <div class="project-header">
            <h3 class="project-title">{{ project.title }}</h3>
            <a
              v-if="project.link"
              :href="project.link"
              target="_blank"
              rel="noopener noreferrer"
              class="project-link"
              :title="`Open ${project.title}`"
            >
              <ExternalLink :size="14" />
            </a>
          </div>
          <p class="project-desc">{{ project.description }}</p>
          <div class="project-tags">
            <span v-for="tag in project.tags" :key="tag" class="tag">{{ tag }}</span>
          </div>
        </div>
      </article>
    </div>
  </main>
</template>

<style scoped>
.page {
  padding: 3rem 1.5rem;
}

.page-title {
  font-size: clamp(1.3rem, 4vw, 1.7rem);
  font-weight: 700;
  margin-bottom: 0.375rem;
}

.page-subtitle {
  color: var(--text-secondary);
  font-size: 0.9375rem;
  margin-bottom: 2rem;
}

.empty-state {
  color: var(--text-muted);
  padding: 3rem 0;
  font-size: 0.9375rem;
}

.project-list {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.project-item {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  padding: 1rem;
  margin: 0 -1rem;
  border-radius: 0.5rem;
  transition: background 0.15s;
}

.project-item:hover {
  background: var(--bg-surface);
}

.project-screenshot-link {
  display: block;
  width: 100%;
  border-radius: 0.375rem;
  overflow: hidden;
  border: 1px solid var(--border-subtle);
  transition: border-color 0.15s;
}

.project-screenshot-link:hover {
  border-color: var(--accent);
}

.project-screenshot {
  width: 100%;
  height: auto;
  display: block;
  aspect-ratio: 16 / 9;
  object-fit: cover;
}

.project-body {
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
}

.project-header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.project-title {
  font-size: 1rem;
  font-weight: 600;
  color: var(--text-primary);
}

.project-link {
  color: var(--text-muted);
  transition: color 0.15s;
  display: flex;
  align-items: center;
}

.project-link:hover {
  color: var(--accent);
}

.project-desc {
  font-size: 0.875rem;
  color: var(--text-secondary);
  line-height: 1.5;
}

.project-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.375rem;
}

.tag {
  padding: 0.125rem 0.5rem;
  font-size: 0.6875rem;
  border: 1px solid var(--border-subtle);
  border-radius: 999px;
  color: var(--text-muted);
}
</style>
