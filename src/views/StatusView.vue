<script setup lang="ts">
import { Target, Heart } from 'lucide-vue-next'
import AppFooter from '@/components/AppFooter.vue'

const goals = [
  'Lulus kuliah menggunakan Linux (jurnal, skripsi, etc)',
  'Konsisten daily photo di Instagram',
]

const interests = [
  'Street photography',
  'PC building & optimization',
  'Linux customization',
  'Web development',
]
</script>

<template>
  <main class="container-narrow" style="padding: 3rem 1.5rem; position: relative; z-index: 10">
    <!-- Header -->
    <section style="margin-bottom: 3rem">
      <h1
        class="animate-fade-in-up"
        :style="{ fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: 700, marginBottom: '1rem', color: 'var(--text-primary)' }"
      >
        Status
      </h1>
      <p
        class="animate-fade-in-up animation-delay-200"
        :style="{ fontSize: '1.125rem', color: 'var(--text-muted)' }"
      >
        Apa yang sedang aku kerjakan dan fokuskan saat ini.
      </p>
    </section>

    <!-- Goals Section -->
    <section style="margin-bottom: 3rem">
      <div style="display: flex; align-items: center; gap: 0.75rem; margin-bottom: 1.5rem">
        <div
          :style="{
            width: '2.5rem',
            height: '2.5rem',
            borderRadius: '0.5rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'var(--badge-bg)',
          }"
        >
          <Target :size="20" :style="{ color: 'var(--text-accent)' }" />
        </div>
        <h2
          class="animate-fade-in-up"
          :style="{ fontSize: '1.5rem', fontWeight: 600, color: 'var(--text-primary)' }"
        >
          Goals
        </h2>
      </div>
      <div style="display: flex; flex-direction: column; gap: 0.75rem">
        <div
          v-for="(goal, index) in goals"
          :key="goal"
          class="animate-fade-in-up"
          :style="{
            padding: '1rem',
            borderRadius: '0.75rem',
            background: 'var(--bg-card)',
            border: '1px solid var(--border-primary)',
            animationDelay: `${index * 100 + 200}ms`,
          }"
        >
          <p :style="{ color: 'var(--text-secondary)' }">{{ goal }}</p>
        </div>
      </div>
    </section>

    <!-- Interests Section -->
    <section style="margin-bottom: 3rem">
      <div style="display: flex; align-items: center; gap: 0.75rem; margin-bottom: 1.5rem">
        <div
          :style="{
            width: '2.5rem',
            height: '2.5rem',
            borderRadius: '0.5rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'var(--badge-bg)',
          }"
        >
          <Heart :size="20" style="color: #f472b6" />
        </div>
        <h2
          class="animate-fade-in-up"
          :style="{ fontSize: '1.5rem', fontWeight: 600, color: 'var(--text-primary)' }"
        >
          Interests
        </h2>
      </div>
      <div style="display: flex; flex-wrap: wrap; gap: 0.75rem">
        <span
          v-for="(interest, index) in interests"
          :key="interest"
          class="animate-fade-in-up"
          :style="{
            padding: '0.5rem 1rem',
            borderRadius: '9999px',
            fontSize: '0.875rem',
            background: 'var(--bg-card)',
            border: '1px solid var(--border-primary)',
            color: 'var(--text-secondary)',
            animationDelay: `${index * 100 + 400}ms`,
          }"
        >
          {{ interest }}
        </span>
      </div>
    </section>

    <AppFooter />
  </main>
</template>
