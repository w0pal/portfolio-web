<script setup lang="ts">
import { useStatusPage } from '@/composables/useStatusPage'

const { statusData } = useStatusPage()
</script>

<template>
  <main class="container page">
    <h1 class="page-title">Now</h1>
    <p class="page-subtitle">What I'm up to these days.</p>

    <section class="section">
      <h2 class="section-title">Goals</h2>
      <ul class="item-list">
        <li v-for="(goal, i) in statusData.goals" :key="i" class="item">{{ goal }}</li>
      </ul>
    </section>

    <section class="section">
      <h2 class="section-title">Interests</h2>
      <ul class="item-list">
        <li v-for="(interest, i) in statusData.interests" :key="i" class="item">{{ interest }}</li>
      </ul>
    </section>
  </main>
</template>

<style scoped>
.page {
  padding: 3rem 1.5rem;
}

.page-title {
  font-size: clamp(1.3rem, 4vw, 1.7rem);
  font-weight: 700;
  margin-bottom: 0.375rem;
}

.page-subtitle {
  color: var(--text-secondary);
  font-size: 0.9375rem;
  margin-bottom: 2rem;
}

.section {
  margin-bottom: 2.5rem;
}

.section-title {
  font-size: 1rem;
  font-weight: 600;
  margin-bottom: 0.75rem;
  color: var(--text-primary);
}

.item-list {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.item {
  position: relative;
  padding-left: 1.25rem;
  font-size: 0.9375rem;
  color: var(--text-secondary);
  line-height: 1.6;
}

.item::before {
  content: '-';
  position: absolute;
  left: 0;
  color: var(--text-muted);
}
</style>
