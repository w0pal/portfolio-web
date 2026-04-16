<script setup lang="ts">
import { computed } from 'vue'
import { Calendar, ExternalLink, ArrowRight } from 'lucide-vue-next'

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
    :style="{
      display: 'block',
      borderRadius: '0.75rem',
      overflow: 'hidden',
      transition: 'all 0.3s',
      background: 'var(--bg-card)',
      border: '1px solid var(--border-primary)',
      textDecoration: 'none',
    }"
  >
    <!-- Thumbnail -->
    <div v-if="post.coverImage" style="position: relative; width: 100%; height: 12rem; overflow: hidden">
      <img
        :src="post.coverImage"
        :alt="post.title"
        style="width: 100%; height: 100%; object-fit: cover; transition: transform 0.3s"
      />
    </div>

    <!-- Content -->
    <div style="padding: 1.5rem">
      <h3
        class="line-clamp-2"
        :style="{
          fontSize: '1.25rem',
          fontWeight: 700,
          marginBottom: '0.75rem',
          color: 'var(--text-primary)',
          transition: 'color 0.2s',
        }"
      >
        {{ post.title }}
      </h3>

      <p
        v-if="post.description"
        class="line-clamp-3"
        :style="{
          fontSize: '0.875rem',
          marginBottom: '1rem',
          color: 'var(--text-secondary)',
        }"
      >
        {{ post.description }}
      </p>

      <!-- Meta Info -->
      <div style="display: flex; flex-wrap: wrap; align-items: center; gap: 1rem; font-size: 0.875rem">
        <div :style="{ display: 'flex', alignItems: 'center', gap: '0.375rem', color: 'var(--text-muted)' }">
          <Calendar :size="14" />
          <span>{{ date }}</span>
        </div>

        <div
          :style="{
            padding: '0.125rem 0.5rem',
            fontSize: '0.75rem',
            borderRadius: '9999px',
            display: 'flex',
            alignItems: 'center',
            gap: '0.25rem',
            background: isMedium ? '#000' : 'var(--accent-bg)',
            color: isMedium ? '#fff' : 'var(--accent-text)',
          }"
        >
          {{ isMedium ? 'Medium' : 'Local' }}
          <ExternalLink v-if="isMedium" :size="10" />
        </div>
      </div>

      <!-- Read More -->
      <div
        :style="{
          marginTop: '1rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.25rem',
          fontSize: '0.875rem',
          fontWeight: 500,
          color: 'var(--text-accent)',
        }"
      >
        <span>{{ isMedium ? 'Baca di Medium' : 'Baca selengkapnya' }}</span>
        <ArrowRight :size="16" />
      </div>
    </div>
  </router-link>
</template>
