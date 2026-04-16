<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Save, ArrowLeft } from 'lucide-vue-next'

const route = useRoute()
const router = useRouter()

const isEdit = !!route.params.slug
const loading = ref(false)
const error = ref('')
const fetching = ref(isEdit)

const formData = ref({
  title: '',
  slug: '',
  description: '',
  content: '',
  coverImage: '',
  source: 'LOCAL',
  originalLink: '',
})

async function fetchPost() {
  try {
    const res = await fetch(`/api/blog/${route.params.slug}`)
    if (res.ok) {
      const post = await res.json()
      formData.value = {
        title: post.title,
        slug: post.slug,
        description: post.description || '',
        content: post.content || '',
        coverImage: post.coverImage || '',
        source: post.source,
        originalLink: post.originalLink || '',
      }
    }
  } catch (e) { console.error(e) }
  finally { fetching.value = false }
}

async function handleSubmit() {
  loading.value = true
  error.value = ''
  try {
    const url = isEdit ? `/api/blog/${route.params.slug}` : '/api/blog'
    const method = isEdit ? 'PUT' : 'POST'
    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData.value),
    })
    if (!res.ok) {
      const data = await res.json()
      throw new Error(data.error || 'Something went wrong')
    }
    router.push('/admin/blog')
  } catch (err: any) {
    error.value = err.message
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  if (isEdit) fetchPost()
})
</script>

<template>
  <div style="max-width: 56rem; margin: 0 auto">
    <div style="margin-bottom: 1.5rem; display: flex; align-items: center; justify-content: space-between">
      <h1 :style="{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-primary)' }">
        {{ isEdit ? 'Edit Post' : 'New Post' }}
      </h1>
      <router-link
        to="/admin/blog"
        :style="{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)', textDecoration: 'none' }"
      >
        <ArrowLeft :size="20" />
        Back
      </router-link>
    </div>

    <div v-if="fetching" style="text-align: center; padding: 3rem; color: var(--text-muted)">Loading...</div>

    <form
      v-else
      @submit.prevent="handleSubmit"
      :style="{
        display: 'flex',
        flexDirection: 'column',
        gap: '1.5rem',
        background: 'var(--bg-primary)',
        padding: '1.5rem',
        borderRadius: '0.75rem',
        border: '1px solid var(--border-primary)',
      }"
    >
      <div v-if="error" :style="{ padding: '1rem', background: '#fef2f2', color: '#dc2626', borderRadius: '0.5rem', fontSize: '0.875rem' }">
        {{ error }}
      </div>

      <div class="form-grid">
        <div>
          <label :style="{ display: 'block', fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-secondary)', marginBottom: '0.25rem' }">Title</label>
          <input v-model="formData.title" required type="text"
            :style="{ width: '100%', padding: '0.5rem 1rem', borderRadius: '0.5rem', border: '1px solid var(--border-input)', background: 'var(--bg-input)', color: 'var(--text-primary)', outline: 'none', fontFamily: 'inherit', fontSize: '0.875rem' }" />
        </div>
        <div>
          <label :style="{ display: 'block', fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-secondary)', marginBottom: '0.25rem' }">Slug (Optional, auto-generated)</label>
          <input v-model="formData.slug" type="text" placeholder="my-post-slug"
            :style="{ width: '100%', padding: '0.5rem 1rem', borderRadius: '0.5rem', border: '1px solid var(--border-input)', background: 'var(--bg-input)', color: 'var(--text-primary)', outline: 'none', fontFamily: 'inherit', fontSize: '0.875rem' }" />
        </div>
      </div>

      <div>
        <label :style="{ display: 'block', fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-secondary)', marginBottom: '0.25rem' }">Source</label>
        <select v-model="formData.source"
          :style="{ width: '100%', padding: '0.5rem 1rem', borderRadius: '0.5rem', border: '1px solid var(--border-input)', background: 'var(--bg-input)', color: 'var(--text-primary)', outline: 'none', fontFamily: 'inherit', fontSize: '0.875rem' }">
          <option value="LOCAL">Local (Write here)</option>
          <option value="MEDIUM">Medium (External Link)</option>
        </select>
      </div>

      <div v-if="formData.source === 'MEDIUM'">
        <label :style="{ display: 'block', fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-secondary)', marginBottom: '0.25rem' }">Original Medium Link</label>
        <input v-model="formData.originalLink" required type="url" placeholder="https://medium.com/@user/story-slug"
          :style="{ width: '100%', padding: '0.5rem 1rem', borderRadius: '0.5rem', border: '1px solid var(--border-input)', background: 'var(--bg-input)', color: 'var(--text-primary)', outline: 'none', fontFamily: 'inherit', fontSize: '0.875rem' }" />
      </div>

      <div v-else>
        <label :style="{ display: 'block', fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-secondary)', marginBottom: '0.25rem' }">Content</label>
        <textarea v-model="formData.content" rows="12" placeholder="Write your post content (HTML supported)..."
          :style="{ width: '100%', padding: '0.5rem 1rem', borderRadius: '0.5rem', border: '1px solid var(--border-input)', background: 'var(--bg-input)', color: 'var(--text-primary)', outline: 'none', fontFamily: 'inherit', fontSize: '0.875rem', resize: 'vertical' }" />
      </div>

      <div>
        <label :style="{ display: 'block', fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-secondary)', marginBottom: '0.25rem' }">Description (Excerpt)</label>
        <textarea v-model="formData.description" rows="3" placeholder="Short summary for preview cards..."
          :style="{ width: '100%', padding: '0.5rem 1rem', borderRadius: '0.5rem', border: '1px solid var(--border-input)', background: 'var(--bg-input)', color: 'var(--text-primary)', outline: 'none', fontFamily: 'inherit', fontSize: '0.875rem', resize: 'vertical' }" />
      </div>

      <div>
        <label :style="{ display: 'block', fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-secondary)', marginBottom: '0.25rem' }">Cover Image URL (Optional)</label>
        <input v-model="formData.coverImage" type="url"
          :style="{ width: '100%', padding: '0.5rem 1rem', borderRadius: '0.5rem', border: '1px solid var(--border-input)', background: 'var(--bg-input)', color: 'var(--text-primary)', outline: 'none', fontFamily: 'inherit', fontSize: '0.875rem' }" />
      </div>

      <button type="submit" :disabled="loading"
        :style="{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '0.5rem',
          padding: '0.75rem',
          background: '#2563eb',
          color: '#fff',
          fontWeight: 500,
          borderRadius: '0.5rem',
          border: 'none',
          cursor: 'pointer',
          fontFamily: 'inherit',
          fontSize: '0.875rem',
          opacity: loading ? 0.5 : 1,
        }"
      >
        <Save :size="20" />
        {{ loading ? 'Saving...' : 'Save Post' }}
      </button>
    </form>
  </div>
</template>

<style scoped>
.form-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;
}
@media (min-width: 768px) {
  .form-grid {
    grid-template-columns: 1fr 1fr;
  }
}
</style>
