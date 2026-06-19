<script setup lang="ts">
import { computed } from 'vue'

interface BlogPost {
  id: string
  title: string
  slug: string
  description: string | null
  coverImage: string | null
  source: string
  originalLink: string | null
  createdAt: string
}

const props = defineProps<{
  post: BlogPost
}>()

const isMedium = computed(() => props.post.source === 'MEDIUM')

const date = computed(() =>
  new Date(props.post.createdAt).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
)
</script>

<template>
  <router-link
    :to="`/blog/${post.slug}`"
    class="blog-row"
  >
    <div class="row-meta">
      <span>{{ date }}</span>
      <span v-if="isMedium" class="source-badge">Medium</span>
    </div>
    <h3 class="row-title">{{ post.title }}</h3>
    <p v-if="post.description" class="row-desc">{{ post.description }}</p>
  </router-link>
</template>

<style scoped>
.blog-row {
  display: block;
  padding: 0.875rem 1rem;
  margin: 0 -1rem;
  border-radius: 0.5rem;
  transition: background 0.15s;
  text-decoration: none;
}

.blog-row:hover {
  background: var(--bg-surface);
}

.row-meta {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.75rem;
  color: var(--text-muted);
  margin-bottom: 0.25rem;
}

.source-badge {
  padding: 0.0625rem 0.375rem;
  font-size: 0.625rem;
  border-radius: 999px;
  border: 1px solid var(--border-subtle);
}

.row-title {
  font-size: 1rem;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 0.125rem;
}

.row-desc {
  font-size: 0.8125rem;
  color: var(--text-secondary);
  line-height: 1.45;
}
</style>
