<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { Plus, Edit, Eye, ExternalLink, Trash2 } from 'lucide-vue-next'
import { useRouter } from 'vue-router'

interface BlogPost {
  id: string
  title: string
  slug: string
  source: string
  originalLink: string | null
  createdAt: string
  isFromMedium?: boolean
}

const router = useRouter()
const posts = ref<BlogPost[]>([])
const loading = ref(true)

async function deletePost(slug: string) {
  if (!confirm('Are you sure you want to delete this post?')) return
  try {
    const res = await fetch(`/api/blog/${slug}`, { method: 'DELETE' })
    if (res.ok) posts.value = posts.value.filter((p) => p.slug !== slug)
    else alert('Failed to delete')
  } catch { alert('Error deleting post') }
}

onMounted(async () => {
  try {
    const res = await fetch('/api/blog')
    if (res.ok) posts.value = await res.json()
  } catch (e) { console.error(e) }
  finally { loading.value = false }
})
</script>

<template>
  <div style="display: flex; flex-direction: column; gap: 1.5rem">
    <div style="display: flex; align-items: center; justify-content: space-between">
      <h1 :style="{ fontSize: '1.875rem', fontWeight: 700, color: 'var(--text-primary)' }">Blog Posts</h1>
      <router-link
        to="/admin/blog/new"
        :style="{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          padding: '0.5rem 1rem',
          background: '#2563eb',
          color: '#fff',
          borderRadius: '0.5rem',
          textDecoration: 'none',
          fontSize: '0.875rem',
          fontWeight: 500,
        }"
      >
        <Plus :size="18" />
        Write Post
      </router-link>
    </div>

    <div v-if="loading" style="text-align: center; padding: 3rem; color: var(--text-muted)">Loading...</div>

    <div v-else style="display: flex; flex-direction: column; gap: 0.75rem">
      <div
        v-for="post in posts"
        :key="post.id"
        :style="{
          background: 'var(--bg-primary)',
          borderRadius: '0.75rem',
          border: '1px solid var(--border-primary)',
          padding: '1rem',
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          gap: '0.75rem',
        }"
      >
        <div style="flex: 1; min-width: 0">
          <h3 class="line-clamp-2" :style="{ fontWeight: 500, color: 'var(--text-primary)' }">{{ post.title }}</h3>
          <div style="display: flex; align-items: center; gap: 0.5rem; margin-top: 0.5rem">
            <span
              :style="{
                padding: '0.125rem 0.5rem',
                fontSize: '0.75rem',
                borderRadius: '9999px',
                background: post.source === 'MEDIUM' ? '#000' : 'var(--accent-bg)',
                color: post.source === 'MEDIUM' ? '#fff' : 'var(--accent-text)',
              }"
            >
              {{ post.source }}
            </span>
            <span :style="{ fontSize: '0.75rem', color: 'var(--text-muted)' }">
              {{ new Date(post.createdAt).toLocaleDateString() }}
            </span>
          </div>
        </div>
        <div style="display: flex; align-items: center; gap: 0.25rem">
          <router-link
            :to="`/blog/${post.slug}`"
            style="padding: 0.5rem; color: #16a34a; border-radius: 0.5rem; display: inline-flex"
          >
            <Eye :size="18" />
          </router-link>
          <template v-if="!post.isFromMedium && post.source !== 'MEDIUM'">
            <button
              @click="router.push(`/admin/blog/${post.slug}`)"
              style="padding: 0.5rem; border: none; background: none; cursor: pointer; color: #2563eb; border-radius: 0.5rem"
            >
              <Edit :size="18" />
            </button>
            <button
              @click="deletePost(post.slug)"
              style="padding: 0.5rem; border: none; background: none; cursor: pointer; color: #ef4444; border-radius: 0.5rem"
            >
              <Trash2 :size="18" />
            </button>
          </template>
          <a
            v-if="post.originalLink"
            :href="post.originalLink"
            target="_blank"
            rel="noopener noreferrer"
            style="padding: 0.5rem; color: var(--text-muted); border-radius: 0.5rem; display: inline-flex"
          >
            <ExternalLink :size="18" />
          </a>
        </div>
      </div>
      <div v-if="posts.length === 0" style="text-align: center; padding: 3rem; color: var(--text-muted)">
        No blog posts found. Write something new!
      </div>
    </div>

    <p :style="{ fontSize: '0.875rem', color: 'var(--text-muted)' }">
      Posts from Medium RSS are read-only. To edit them, manage them directly on Medium.
    </p>
  </div>
</template>
