<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Save, ArrowLeft } from 'lucide-vue-next'

const route = useRoute()
const router = useRouter()

const isEdit = !!route.params.id
const loading = ref(false)
const error = ref('')
const fetching = ref(isEdit)

const formData = ref({
  title: '',
  description: '',
  link: '',
  imageUrl: '',
  tags: '',
})

async function fetchItem() {
  try {
    const res = await fetch(`/api/portfolio/${route.params.id}`)
    if (res.ok) {
      const item = await res.json()
      formData.value.title = item.title
      formData.value.description = item.description
      formData.value.link = item.link || ''
      formData.value.imageUrl = item.imageUrl || ''
      try {
        const parsed = JSON.parse(item.tags)
        formData.value.tags = Array.isArray(parsed) ? parsed.join(', ') : item.tags
      } catch { formData.value.tags = item.tags }
    }
  } catch (e) { console.error(e) }
  finally { fetching.value = false }
}

async function handleSubmit() {
  loading.value = true
  error.value = ''
  try {
    const tagsArray = formData.value.tags.split(',').map((t) => t.trim()).filter(Boolean)
    const url = isEdit ? `/api/portfolio/${route.params.id}` : '/api/portfolio'
    const method = isEdit ? 'PUT' : 'POST'
    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...formData.value, tags: tagsArray }),
    })
    if (!res.ok) {
      const data = await res.json()
      throw new Error(data.error || 'Something went wrong')
    }
    router.push('/admin/portfolio')
  } catch (err: any) {
    error.value = err.message
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  if (isEdit) fetchItem()
})
</script>

<template>
  <div style="max-width: 42rem; margin: 0 auto">
    <div style="margin-bottom: 1.5rem; display: flex; align-items: center; justify-content: space-between">
      <h1 :style="{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-primary)' }">
        {{ isEdit ? 'Edit Project' : 'Add New Project' }}
      </h1>
      <router-link
        to="/admin/portfolio"
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

      <div>
        <label :style="{ display: 'block', fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-secondary)', marginBottom: '0.25rem' }">Project Title</label>
        <input v-model="formData.title" required type="text" placeholder="e.g., Portfolio Website"
          :style="{ width: '100%', padding: '0.5rem 1rem', borderRadius: '0.5rem', border: '1px solid var(--border-input)', background: 'var(--bg-input)', color: 'var(--text-primary)', outline: 'none', fontFamily: 'inherit', fontSize: '0.875rem' }" />
      </div>

      <div>
        <label :style="{ display: 'block', fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-secondary)', marginBottom: '0.25rem' }">Description</label>
        <textarea v-model="formData.description" required rows="4" placeholder="Brief description..."
          :style="{ width: '100%', padding: '0.5rem 1rem', borderRadius: '0.5rem', border: '1px solid var(--border-input)', background: 'var(--bg-input)', color: 'var(--text-primary)', outline: 'none', fontFamily: 'inherit', fontSize: '0.875rem', resize: 'vertical' }" />
      </div>

      <div>
        <label :style="{ display: 'block', fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-secondary)', marginBottom: '0.25rem' }">Project Link</label>
        <input v-model="formData.link" type="url" placeholder="https://example.com"
          :style="{ width: '100%', padding: '0.5rem 1rem', borderRadius: '0.5rem', border: '1px solid var(--border-input)', background: 'var(--bg-input)', color: 'var(--text-primary)', outline: 'none', fontFamily: 'inherit', fontSize: '0.875rem' }" />
      </div>

      <div>
        <label :style="{ display: 'block', fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-secondary)', marginBottom: '0.25rem' }">Image URL (Optional)</label>
        <input v-model="formData.imageUrl" type="url" placeholder="https://..."
          :style="{ width: '100%', padding: '0.5rem 1rem', borderRadius: '0.5rem', border: '1px solid var(--border-input)', background: 'var(--bg-input)', color: 'var(--text-primary)', outline: 'none', fontFamily: 'inherit', fontSize: '0.875rem' }" />
      </div>

      <div>
        <label :style="{ display: 'block', fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-secondary)', marginBottom: '0.25rem' }">Tags</label>
        <input v-model="formData.tags" type="text" placeholder="React, Next.js, Tailwind (comma separated)"
          :style="{ width: '100%', padding: '0.5rem 1rem', borderRadius: '0.5rem', border: '1px solid var(--border-input)', background: 'var(--bg-input)', color: 'var(--text-primary)', outline: 'none', fontFamily: 'inherit', fontSize: '0.875rem' }" />
      </div>

      <button
        type="submit"
        :disabled="loading"
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
        {{ loading ? 'Saving...' : 'Save Project' }}
      </button>
    </form>
  </div>
</template>
