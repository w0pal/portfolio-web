<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Save, Loader } from 'lucide-vue-next'

const route = useRoute()
const router = useRouter()
const slug = route.params.slug as string
const error = ref('')
const loading = ref(true)
const saving = ref(false)

// Dynamic Form Data
const aboutData = ref({
  aboutParagraphs: [
    'Seorang mahasiswa informatika tingkat ketiga yang memiliki passion di bidang teknologi dan fotografi. Perjalanan sebagai PC Enthusiast dimulai sejak 2020, kemudian beralih menjadi pengguna Linux Desktop sejak 2023.',
    'Selain teknologi, fotografi menjadi hobi kedua yang bermula dari aktivitas di media sosial. Memiliki ketertarikan khusus pada genre street photography, baik menggunakan kamera maupun smartphone.'
  ],
  interests: [
    { icon: 'Monitor', title: 'PC Enthusiast', description: 'Sejak 2020, membangun dan mengoptimalkan PC' },
    { icon: 'Code', title: 'Linux User', description: 'Pengguna Linux Desktop sejak 2023' },
    { icon: 'Camera', title: 'Fotografer', description: 'Street photography dengan kamera & smartphone' }
  ]
})

const statusData = ref({
  goals: [
    'Lulus kuliah menggunakan Linux (jurnal, skripsi, etc)',
    'Konsisten daily photo di Instagram'
  ],
  interests: [
    'Street photography',
    'PC building & optimization',
    'Linux customization',
    'Web development'
  ]
})

// Optional Icon list for 'about'
const iconOptions = ['Monitor', 'Code', 'Camera', 'Heart', 'Target', 'FileText', 'Image']

async function loadData() {
  loading.value = true
  try {
    const res = await fetch(`/api/pages/${slug}`)
    if (res.ok) {
      const data = await res.json()
      if (slug === 'about') Object.assign(aboutData.value, data)
      if (slug === 'status') Object.assign(statusData.value, data)
    } else if (res.status === 404) {
      // Keep using default ref logic which has initial fallback
    } else {
      error.value = 'Failed to load page data'
    }
  } catch (err) {
    error.value = 'Network error'
  } finally {
    loading.value = false
  }
}

async function save() {
  error.value = ''
  saving.value = true
  const dataToSave = slug === 'about' ? aboutData.value : statusData.value
  
  try {
    const res = await fetch(`/api/pages/${slug}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dataToSave)
    })
    
    if (!res.ok) throw new Error('Failed to save')
    router.push('/admin/pages')
  } catch (err) {
    error.value = 'Failed to save changes'
  } finally {
    saving.value = false
  }
}

onMounted(() => {
  loadData()
})

// Helpers for arrays
function addAboutParagraph() { aboutData.value.aboutParagraphs.push('') }
function removeAboutParagraph(idx: number) { aboutData.value.aboutParagraphs.splice(idx, 1) }

function addAboutInterest() { aboutData.value.interests.push({ icon: 'Monitor', title: '', description: '' }) }
function removeAboutInterest(idx: number) { aboutData.value.interests.splice(idx, 1) }

function addStatusGoal() { statusData.value.goals.push('') }
function removeStatusGoal(idx: number) { statusData.value.goals.splice(idx, 1) }

function addStatusInterest() { statusData.value.interests.push('') }
function removeStatusInterest(idx: number) { statusData.value.interests.splice(idx, 1) }

</script>

<template>
  <div class="animate-fade-in-up" style="max-width: 800px">
    <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 2rem">
      <h1 :style="{ fontSize: '1.875rem', fontWeight: 700, color: 'var(--text-primary)' }">
        Edit {{ slug === 'about' ? 'About' : 'Status' }} Page
      </h1>
      <button
        @click="save"
        :disabled="saving"
        :style="{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          padding: '0.75rem 1.5rem',
          background: 'var(--text-accent)',
          color: '#fff',
          border: 'none',
          borderRadius: '0.5rem',
          fontWeight: 600,
          cursor: saving ? 'not-allowed' : 'pointer',
          opacity: saving ? 0.7 : 1,
        }"
      >
        <Loader v-if="saving" class="animate-spin" :size="20" />
        <Save v-else :size="20" />
        {{ saving ? 'Saving...' : 'Save Changes' }}
      </button>
    </div>

    <!-- Error state -->
    <div v-if="error" :style="{ backgroundColor: '#fee2e2', color: '#b91c1c', padding: '1rem', borderRadius: '0.5rem', marginBottom: '1.5rem' }">
      {{ error }}
    </div>

    <!-- Loading state -->
    <div v-if="loading" :style="{ color: 'var(--text-muted)' }">
      Loading page content...
    </div>

    <div v-else class="form-container">
      <!-- ABOUT PAGE FORM -->
      <template v-if="slug === 'about'">
        <!-- Paragraphs -->
        <section class="form-section">
          <h2 class="section-title">About Text (Paragraphs)</h2>
          <div v-for="(p, i) in aboutData.aboutParagraphs" :key="i" class="list-item">
            <textarea
              v-model="aboutData.aboutParagraphs[i]"
              class="form-input"
              rows="3"
              style="width: 100%"
            ></textarea>
            <button @click="removeAboutParagraph(i)" class="btn-remove">Remove</button>
          </div>
          <button @click="addAboutParagraph" class="btn-add">+ Add Paragraph</button>
        </section>

        <!-- Interests Grid -->
        <section class="form-section">
          <h2 class="section-title">Interests Grid</h2>
          <div v-for="(item, i) in aboutData.interests" :key="i" class="list-item-column">
            <div style="display: flex; gap: 1rem; width: 100%">
              <select v-model="item.icon" class="form-input" style="flex: 1">
                <option v-for="icon in iconOptions" :key="icon" :value="icon">{{ icon }}</option>
              </select>
              <input v-model="item.title" class="form-input" style="flex: 2" placeholder="Title" />
            </div>
            <textarea v-model="item.description" class="form-input" rows="2" style="width: 100%" placeholder="Description..."></textarea>
            <button @click="removeAboutInterest(i)" class="btn-remove">Remove Item</button>
          </div>
          <button @click="addAboutInterest" class="btn-add">+ Add Interest</button>
        </section>
      </template>

      <!-- STATUS PAGE FORM -->
      <template v-if="slug === 'status'">
        <!-- Goals -->
        <section class="form-section">
          <h2 class="section-title">Goals (Target)</h2>
          <div v-for="(goal, i) in statusData.goals" :key="i" class="list-item">
            <input v-model="statusData.goals[i]" class="form-input" style="width: 100%" />
            <button @click="removeStatusGoal(i)" class="btn-remove">Remove</button>
          </div>
          <button @click="addStatusGoal" class="btn-add">+ Add Goal</button>
        </section>

        <!-- Interests -->
        <section class="form-section">
          <h2 class="section-title">Interests (Tags)</h2>
          <div v-for="(interest, i) in statusData.interests" :key="i" class="list-item">
            <input v-model="statusData.interests[i]" class="form-input" style="width: 100%" />
            <button @click="removeStatusInterest(i)" class="btn-remove">Remove</button>
          </div>
          <button @click="addStatusInterest" class="btn-add">+ Add Interest</button>
        </section>
      </template>
    </div>
  </div>
</template>

<style scoped>
.form-container {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}
.form-section {
  background: var(--bg-card);
  padding: 1.5rem;
  border-radius: 0.75rem;
  border: 1px solid var(--border-primary);
}
.section-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 1rem;
}
.list-item {
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
  align-items: flex-start;
}
.list-item-column {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
  padding: 1rem;
  border: 1px solid var(--border-primary);
  border-radius: 0.5rem;
}
.form-input {
  padding: 0.75rem;
  border-radius: 0.5rem;
  border: 1px solid var(--border-primary);
  background: var(--bg-primary);
  color: var(--text-primary);
  resize: vertical;
}
.form-input:focus {
  outline: 2px solid var(--text-accent);
  border-color: transparent;
}
.btn-remove {
  background: transparent;
  color: #ef4444;
  border: 1px solid #ef4444;
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  cursor: pointer;
}
.btn-add {
  background: var(--bg-primary);
  color: var(--text-accent);
  border: 1px dashed var(--text-accent);
  padding: 0.75rem;
  border-radius: 0.5rem;
  width: 100%;
  cursor: pointer;
  font-weight: 500;
}
</style>
