<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { Save, Plus, Trash2 } from 'lucide-vue-next'

const loading = ref(false)
const fetching = ref(true)
const error = ref('')
const success = ref('')

const formData = ref({
  aboutText: '',
  interests: [] as { icon: string; title: string; description: string }[]
})

// Default data in case DB is empty
const defaultData = {
  aboutText: `Seorang mahasiswa informatika tingkat ketiga yang memiliki passion di bidang teknologi dan fotografi. Perjalanan sebagai PC Enthusiast dimulai sejak 2020, kemudian beralih menjadi pengguna Linux Desktop sejak 2023.

Selain teknologi, fotografi menjadi hobi kedua yang bermula dari aktivitas di media sosial. Memiliki ketertarikan khusus pada genre street photography, baik menggunakan kamera maupun smartphone.`,
  interests: [
    { icon: 'Monitor', title: 'PC Enthusiast', description: 'Sejak 2020, membangun dan mengoptimalkan PC' },
    { icon: 'Code', title: 'Linux User', description: 'Pengguna Linux Desktop sejak 2023' },
    { icon: 'Camera', title: 'Fotografer', description: 'Street photography dengan kamera & smartphone' },
  ]
}

const availableIcons = ['Monitor', 'Code', 'Camera', 'MapPin', 'Terminal', 'Cpu', 'Award', 'Briefcase', 'Heart', 'Star']

async function fetchContent() {
  try {
    const res = await fetch('/api/content/about')
    if (res.ok) {
      const data = await res.json()
      formData.value.aboutText = data.aboutText || defaultData.aboutText
      formData.value.interests = data.interests || defaultData.interests
    } else {
      // If 404, just use default
      formData.value.aboutText = defaultData.aboutText
      formData.value.interests = JSON.parse(JSON.stringify(defaultData.interests))
    }
  } catch (e) {
    console.error(e)
    formData.value.aboutText = defaultData.aboutText
    formData.value.interests = JSON.parse(JSON.stringify(defaultData.interests))
  } finally {
    fetching.value = false
  }
}

async function handleSubmit() {
  loading.value = true
  error.value = ''
  success.value = ''
  try {
    const res = await fetch('/api/content/about', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData.value),
    })

    if (!res.ok) {
      const data = await res.json()
      throw new Error(data.error || 'Failed to update content')
    }

    success.value = 'About page content updated successfully!'
    setTimeout(() => { success.value = '' }, 3000)
  } catch (err: any) {
    error.value = err.message
  } finally {
    loading.value = false
  }
}

function addInterest() {
  formData.value.interests.push({ icon: 'Star', title: '', description: '' })
}

function removeInterest(index: number) {
  formData.value.interests.splice(index, 1)
}

onMounted(() => {
  fetchContent()
})
</script>

<template>
  <div style="max-width: 48rem; margin: 0 auto">
    <div style="margin-bottom: 1.5rem">
      <h1 :style="{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-primary)' }">
        About Page Settings
      </h1>
      <p :style="{ color: 'var(--text-muted)', fontSize: '0.875rem' }">Manage the content displayed on the About page.</p>
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
      <div v-if="success" :style="{ padding: '1rem', background: '#f0fdf4', color: '#16a34a', borderRadius: '0.5rem', fontSize: '0.875rem' }">
        {{ success }}
      </div>

      <!-- About Text -->
      <div>
        <label :style="{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.5rem' }">
          Tentang (Biography)
        </label>
        <p :style="{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }">
          Basic text. Double line break creates a new paragraph.
        </p>
        <textarea v-model="formData.aboutText" required rows="6"
          :style="{ width: '100%', padding: '0.75rem 1rem', borderRadius: '0.5rem', border: '1px solid var(--border-input)', background: 'var(--bg-input)', color: 'var(--text-primary)', outline: 'none', fontFamily: 'inherit', fontSize: '0.875rem', resize: 'vertical' }" />
      </div>

      <hr :style="{ borderTop: '1px solid var(--border-secondary)', margin: '1rem 0' }" />

      <!-- Interests -->
      <div>
        <div style="display: flex; justify-content: space-between; align-items: center; marginBottom: 1rem">
          <div>
            <label :style="{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-primary)' }">
              Minat & Keahlian
            </label>
            <p :style="{ fontSize: '0.75rem', color: 'var(--text-muted)' }">List of skills or interests shown as cards.</p>
          </div>
          <button
            type="button"
            @click="addInterest"
            :style="{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.5rem 0.75rem',
              background: 'var(--bg-card)',
              color: 'var(--text-primary)',
              border: '1px solid var(--border-primary)',
              borderRadius: '0.5rem',
              fontSize: '0.875rem',
              cursor: 'pointer',
            }"
          >
            <Plus :size="16" /> Add
          </button>
        </div>

        <div style="display: flex; flexDirection: column; gap: 1rem">
          <div
            v-for="(item, index) in formData.interests"
            :key="index"
            :style="{
              padding: '1rem',
              border: '1px solid var(--border-secondary)',
              borderRadius: '0.5rem',
              background: 'var(--bg-secondary)',
              position: 'relative'
            }"
          >
            <button
              type="button"
              @click="removeInterest(index)"
              :style="{
                position: 'absolute',
                top: '0.5rem',
                right: '0.5rem',
                background: 'none',
                border: 'none',
                color: '#ef4444',
                cursor: 'pointer',
                padding: '0.25rem'
              }"
              aria-label="Remove"
            >
              <Trash2 :size="16" />
            </button>
            
            <div style="display: grid; gap: 0.75rem; paddingRight: 2rem">
              <div>
                <label :style="{ display: 'block', fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '0.25rem' }">Icon Name (Lucide)</label>
                <select v-model="item.icon" :style="{ width: '100%', padding: '0.5rem', borderRadius: '0.5rem', border: '1px solid var(--border-input)', background: 'var(--bg-input)', color: 'var(--text-primary)', outline: 'none', fontFamily: 'inherit', fontSize: '0.875rem' }">
                  <option v-for="icon in availableIcons" :key="icon" :value="icon">{{ icon }}</option>
                </select>
              </div>
              <div>
                <label :style="{ display: 'block', fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '0.25rem' }">Title</label>
                <input v-model="item.title" type="text" required :style="{ width: '100%', padding: '0.5rem', borderRadius: '0.5rem', border: '1px solid var(--border-input)', background: 'var(--bg-input)', color: 'var(--text-primary)', outline: 'none', fontFamily: 'inherit', fontSize: '0.875rem' }" />
              </div>
              <div>
                <label :style="{ display: 'block', fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '0.25rem' }">Description</label>
                <input v-model="item.description" type="text" required :style="{ width: '100%', padding: '0.5rem', borderRadius: '0.5rem', border: '1px solid var(--border-input)', background: 'var(--bg-input)', color: 'var(--text-primary)', outline: 'none', fontFamily: 'inherit', fontSize: '0.875rem' }" />
              </div>
            </div>
          </div>
        </div>
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
          marginTop: '1rem',
          opacity: loading ? 0.5 : 1,
        }"
      >
        <Save :size="20" />
        {{ loading ? 'Saving...' : 'Save Changes' }}
      </button>
    </form>
  </div>
</template>
