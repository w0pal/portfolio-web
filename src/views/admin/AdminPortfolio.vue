<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { Plus, Edit, Trash2 } from 'lucide-vue-next'
import { useRouter } from 'vue-router'

interface PortfolioItem {
  id: string
  title: string
  description: string
  tags: string
  createdAt: string
}

const router = useRouter()
const items = ref<PortfolioItem[]>([])
const loading = ref(true)

function parseTags(t: string): string[] {
  try { const p = JSON.parse(t); return Array.isArray(p) ? p : [t] } catch { return [t] }
}

async function deleteItem(id: string) {
  if (!confirm('Are you sure you want to delete this item?')) return
  try {
    const res = await fetch(`/api/portfolio/${id}`, { method: 'DELETE' })
    if (res.ok) items.value = items.value.filter((i) => i.id !== id)
    else alert('Failed to delete')
  } catch { alert('Error deleting item') }
}

onMounted(async () => {
  try {
    const res = await fetch('/api/portfolio')
    if (res.ok) items.value = await res.json()
  } catch (e) { console.error(e) }
  finally { loading.value = false }
})
</script>

<template>
  <div style="display: flex; flex-direction: column; gap: 1.5rem">
    <div style="display: flex; align-items: center; justify-content: space-between">
      <h1 :style="{ fontSize: '1.875rem', fontWeight: 700, color: 'var(--text-primary)' }">Portfolio</h1>
      <router-link
        to="/admin/portfolio/new"
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
        Add New
      </router-link>
    </div>

    <div v-if="loading" style="text-align: center; padding: 3rem; color: var(--text-muted)">Loading...</div>

    <div v-else style="display: flex; flex-direction: column; gap: 0.75rem">
      <div
        v-for="item in items"
        :key="item.id"
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
          <h3 class="truncate" :style="{ fontWeight: 500, color: 'var(--text-primary)' }">{{ item.title }}</h3>
          <p class="line-clamp-2" :style="{ fontSize: '0.875rem', color: 'var(--text-muted)', marginTop: '0.25rem' }">{{ item.description }}</p>
          <div style="display: flex; flex-wrap: wrap; gap: 0.25rem; margin-top: 0.5rem">
            <span
              v-for="(tag, i) in parseTags(item.tags).slice(0, 3)"
              :key="i"
              :style="{
                padding: '0.125rem 0.5rem',
                fontSize: '0.75rem',
                borderRadius: '9999px',
                background: 'var(--badge-bg)',
                color: 'var(--badge-text)',
              }"
            >{{ tag }}</span>
          </div>
        </div>
        <div style="display: flex; align-items: center; gap: 0.25rem">
          <button
            @click="router.push(`/admin/portfolio/${item.id}`)"
            style="padding: 0.5rem; border: none; background: none; cursor: pointer; color: #2563eb; border-radius: 0.5rem"
          >
            <Edit :size="18" />
          </button>
          <button
            @click="deleteItem(item.id)"
            style="padding: 0.5rem; border: none; background: none; cursor: pointer; color: #ef4444; border-radius: 0.5rem"
          >
            <Trash2 :size="18" />
          </button>
        </div>
      </div>
      <div v-if="items.length === 0" style="text-align: center; padding: 3rem; color: var(--text-muted)">
        No portfolio items found. Create one to get started.
      </div>
    </div>
  </div>
</template>
