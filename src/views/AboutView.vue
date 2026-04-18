<script setup lang="ts">
import { ref, onMounted } from 'vue'
import * as icons from 'lucide-vue-next'
import AppFooter from '@/components/AppFooter.vue'

const aboutText = ref(`Seorang mahasiswa informatika tingkat ketiga yang memiliki passion di bidang teknologi dan fotografi. Perjalanan sebagai PC Enthusiast dimulai sejak 2020, kemudian beralih menjadi pengguna Linux Desktop sejak 2023.\n\nSelain teknologi, fotografi menjadi hobi kedua yang bermula dari aktivitas di media sosial. Memiliki ketertarikan khusus pada genre street photography, baik menggunakan kamera maupun smartphone.`)

const interests = ref([
  { icon: 'Monitor', title: 'PC Enthusiast', description: 'Sejak 2020, membangun dan mengoptimalkan PC' },
  { icon: 'Code', title: 'Linux User', description: 'Pengguna Linux Desktop sejak 2023' },
  { icon: 'Camera', title: 'Fotografer', description: 'Street photography dengan kamera & smartphone' },
])

onMounted(async () => {
  try {
    const res = await fetch('/api/content/about')
    if (res.ok) {
      const data = await res.json()
      if (data.aboutText) aboutText.value = data.aboutText
      if (data.interests && data.interests.length > 0) interests.value = data.interests
    }
  } catch (e) {
    console.error('Failed to fetch about content', e)
  }
})
</script>

<template>
  <main class="container-narrow" style="padding: 3rem 1.5rem; position: relative; z-index: 10">
    <!-- Hero Section -->
    <section style="display: flex; flex-direction: column; align-items: center; gap: 2rem; margin-bottom: 4rem" class="about-hero">
      <!-- Profile Photo -->
      <div class="animate-scale-in">
        <div
          :style="{
            position: 'relative',
            width: '10rem',
            height: '10rem',
            borderRadius: '1rem',
            overflow: 'hidden',
            outline: '4px solid var(--border-primary)',
          }"
        >
          <img src="/profile.webp" alt="Mohammad Naufal Maulana" style="width: 100%; height: 100%; object-fit: cover" />
        </div>
      </div>

      <!-- Name & Role -->
      <div style="text-align: center">
        <h1
          class="animate-fade-in-up"
          :style="{ fontSize: 'clamp(1.5rem, 5vw, 2.25rem)', fontWeight: 700, marginBottom: '0.5rem', color: 'var(--text-primary)' }"
        >
          Mohammad Naufal Maulana
        </h1>
        <p
          class="animate-fade-in-up animation-delay-200"
          :style="{ fontSize: '1.125rem', marginBottom: '0.75rem', color: 'var(--text-accent)' }"
        >
          Mahasiswa Informatika
        </p>
        <div
          class="animate-fade-in-up animation-delay-400"
          :style="{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', color: 'var(--text-muted)' }"
        >
          <component :is="icons['MapPin']" :size="14" />
          <span>Indonesia</span>
        </div>
      </div>
    </section>

    <!-- About Section -->
    <section style="margin-bottom: 4rem">
      <h2
        class="animate-fade-in-up"
        :style="{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1.5rem', color: 'var(--text-primary)' }"
      >
        Tentang
      </h2>
      <div class="animate-fade-in-up animation-delay-200" :style="{ color: 'var(--text-secondary)' }">
        <p v-for="(paragraph, index) in aboutText.split('\\n')" :key="index" :style="{ lineHeight: 1.75, marginBottom: index !== aboutText.split('\\n').length - 1 ? '1rem' : '0' }">
          {{ paragraph }}
        </p>
      </div>
    </section>

    <!-- Interests Grid -->
    <section style="margin-bottom: 4rem">
      <h2
        class="animate-fade-in-up"
        :style="{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1.5rem', color: 'var(--text-primary)' }"
      >
        Minat & Keahlian
      </h2>
      <div class="interests-grid">
        <div
          v-for="(item, index) in interests"
          :key="item.title"
          class="animate-fade-in-up"
          :style="{
            padding: '1.5rem',
            borderRadius: '0.75rem',
            background: 'var(--bg-card)',
            border: '1px solid var(--border-primary)',
            animationDelay: `${index * 100 + 200}ms`,
          }"
        >
          <div
            :style="{
              width: '2.5rem',
              height: '2.5rem',
              borderRadius: '0.5rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '1rem',
              background: 'var(--badge-bg)',
            }"
          >
            <component :is="(icons as any)[item.icon] || icons['Star']" :size="20" :style="{ color: 'var(--text-accent)' }" />
          </div>
          <h3 :style="{ fontWeight: 500, marginBottom: '0.5rem', color: 'var(--text-primary)' }">
            {{ item.title }}
          </h3>
          <p :style="{ fontSize: '0.875rem', color: 'var(--text-muted)' }">
            {{ item.description }}
          </p>
        </div>
      </div>
    </section>

    <AppFooter />
  </main>
</template>

<style scoped>
.about-hero {
  flex-direction: column;
}
@media (min-width: 768px) {
  .about-hero {
    flex-direction: row;
  }
  .about-hero > div:last-child {
    text-align: left;
  }
}
.interests-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;
}
@media (min-width: 768px) {
  .interests-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}
</style>
