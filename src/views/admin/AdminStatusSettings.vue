<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { Save, Plus, Trash2 } from 'lucide-vue-next'

const loading = ref(false)
const fetching = ref(true)
const error = ref('')
const success = ref('')

const formData = ref({
  goals: [] as string[],
  interests: [] as string[]
})

// Default data
const defaultData = {
  goals: [
    'Lulus kuliah menggunakan Linux (jurnal, skripsi, etc)',
    'Konsisten daily photo di Instagram',
  ],
  interests: [
    'Street photography',
    'PC building & optimization',
    'Linux customization',
    'Web development',
  ]
}

async function fetchContent() {
  try {
    const res = await fetch('/api/content/status')
    if (res.ok) {
      const data = await res.json()
      formData.value.goals = data.goals || [...defaultData.goals]
      formData.value.interests = data.interests || [...defaultData.interests]
    } else {
      formData.value.goals = [...defaultData.goals]
      formData.value.interests = [...defaultData.interests]
    }
  } catch (e) {
    console.error(e)
    formData.value.goals = [...defaultData.goals]
    formData.value.interests = [...defaultData.interests]
  } finally {
    fetching.value = false
  }
}

async function handleSubmit() {
  loading.value = true
  error.value = ''
  success.value = ''
  try {
    const res = await fetch('/api/content/status', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData.value),
    })

    if (!res.ok) {
      const data = await res.json()
      throw new Error(data.error || 'Failed to update content')
    }

    success.value = 'Status page content updated successfully!'
    setTimeout(() => { success.value = '' }, 3000)
  } catch (err: any) {
    error.value = err.message
  } finally {
    loading.value = false
  }
}

function addGoal() {
  formData.value.goals.push('')
}
function removeGoal(index: number) {
  formData.value.goals.splice(index, 1)
}

function addInterest() {
  formData.value.interests.push('')
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
        Status Page Settings
      </h1>
      <p :style="{ color: 'var(--text-muted)', fontSize: '0.875rem' }">Manage goals and interests on the Status page.</p>
    </div>

    <div v-if="fetching" style="text-align: center; padding: 3rem; color: var(--text-muted)">Loading...</div>

    <form
      v-else
      @submit.prevent="handleSubmit"
      :style="{
        display: 'flex',
        flexDirection: 'column',
        gap: '2rem',
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

      <!-- Goals -->
      <div>
        <div style="display: flex; justify-content: space-between; align-items: center; marginBottom: 1rem">
          <label :style="{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-primary)' }">
            Goals
          </label>
          <button
            type="button"
            @click="addGoal"
            :style="{
              display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 0.75rem',
              background: 'var(--bg-card)', color: 'var(--text-primary)', border: '1px solid var(--border-primary)',
              borderRadius: '0.5rem', fontSize: '0.875rem', cursor: 'pointer',
            }"
          >
            <Plus :size="16" /> Add Goal
          </button>
        </div>

        <div style="display: flex; flexDirection: column; gap: 0.75rem">
          <div
            v-for="(_, index) in formData.goals"
            :key="'goal-'+index"
            style="display: flex; gap: 0.5rem; align-items: center;"
          >
            <input v-model="formData.goals[index]" type="text" required
              :style="{ flex: 1, padding: '0.5rem 1rem', borderRadius: '0.5rem', border: '1px solid var(--border-input)', background: 'var(--bg-input)', color: 'var(--text-primary)', outline: 'none', fontFamily: 'inherit', fontSize: '0.875rem' }" />
            <button
              type="button"
              @click="removeGoal(index)"
              :style="{ padding: '0.5rem', background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer' }"
            >
              <Trash2 :size="18" />
            </button>
          </div>
          <p v-if="formData.goals.length === 0" :style="{ color: 'var(--text-muted)', fontSize: '0.875rem', fontStyle: 'italic' }">No goals added.</p>
        </div>
      </div>

      <hr :style="{ borderTop: '1px solid var(--border-secondary)' }" />

      <!-- Interests -->
      <div>
        <div style="display: flex; justify-content: space-between; align-items: center; marginBottom: 1rem">
          <label :style="{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-primary)' }">
            Interests
          </label>
          <button
            type="button"
            @click="addInterest"
            :style="{
              display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 0.75rem',
              background: 'var(--bg-card)', color: 'var(--text-primary)', border: '1px solid var(--border-primary)',
              borderRadius: '0.5rem', fontSize: '0.875rem', cursor: 'pointer',
            }"
          >
            <Plus :size="16" /> Add Interest
          </button>
        </div>

        <div style="display: flex; flexDirection: column; gap: 0.75rem">
          <div
            v-for="(_, index) in formData.interests"
            :key="'int-'+index"
            style="display: flex; gap: 0.5rem; align-items: center;"
          >
            <input v-model="formData.interests[index]" type="text" required
              :style="{ flex: 1, padding: '0.5rem 1rem', borderRadius: '0.5rem', border: '1px solid var(--border-input)', background: 'var(--bg-input)', color: 'var(--text-primary)', outline: 'none', fontFamily: 'inherit', fontSize: '0.875rem' }" />
            <button
              type="button"
              @click="removeInterest(index)"
              :style="{ padding: '0.5rem', background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer' }"
            >
              <Trash2 :size="18" />
            </button>
          </div>
          <p v-if="formData.interests.length === 0" :style="{ color: 'var(--text-muted)', fontSize: '0.875rem', fontStyle: 'italic' }">No interests added.</p>
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
