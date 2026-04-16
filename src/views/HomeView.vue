<script setup lang="ts">
import { ArrowRight, Sparkles } from 'lucide-vue-next'
import AppFooter from '@/components/AppFooter.vue'
import { navLinks } from '@/config/navigation'

const portfolioLink = navLinks.find((l) => l.label === 'Portfolio')
const aboutLink = navLinks.find((l) => l.label === 'About')
</script>

<template>
  <main
    class="container"
    style="
      min-height: 80vh;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      position: relative;
      z-index: 10;
    "
  >
    <!-- Update Badge -->
    <div
      class="animate-fade-in-up"
      :style="{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.5rem',
        padding: '0.5rem 1rem',
        borderRadius: '9999px',
        marginBottom: '2rem',
        background: 'var(--bg-card)',
        border: '1px solid var(--border-primary)',
      }"
    >
      <Sparkles :size="14" :style="{ color: 'var(--text-accent)' }" />
      <span :style="{ fontSize: '0.875rem', color: 'var(--text-secondary)' }">Personal Website</span>
    </div>

    <!-- Main Title -->
    <h1
      class="animate-fade-in-up animation-delay-200"
      :style="{
        fontSize: 'clamp(3rem, 8vw, 6rem)',
        fontWeight: 700,
        textAlign: 'center',
        marginBottom: '1.5rem',
        color: 'var(--text-primary)',
      }"
    >
      w0pal
    </h1>

    <!-- Tagline -->
    <p
      class="animate-fade-in-up animation-delay-400"
      :style="{
        fontSize: 'clamp(1.125rem, 3vw, 1.5rem)',
        textAlign: 'center',
        marginBottom: '2.5rem',
        maxWidth: '42rem',
        color: 'var(--text-secondary)',
      }"
    >
      Mahasiswa Informatika • PC Enthusiast • Street Photographer
    </p>

    <!-- CTA Buttons -->
    <div
      class="animate-fade-in-up animation-delay-600"
      style="display: flex; flex-wrap: wrap; justify-content: center; gap: 1rem; margin-bottom: 4rem"
    >
      <router-link
        :to="portfolioLink?.href || '/portfolio'"
        :style="{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.5rem',
          padding: '0.75rem 1.5rem',
          borderRadius: '0.5rem',
          fontWeight: 500,
          transition: 'all 0.2s',
          textDecoration: 'none',
          background: 'var(--text-primary)',
          color: 'var(--bg-primary)',
        }"
      >
        <span>Lihat {{ portfolioLink?.label || 'Portfolio' }}</span>
        <ArrowRight :size="18" />
      </router-link>

      <router-link
        :to="aboutLink?.href || '/about'"
        :style="{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.5rem',
          padding: '0.75rem 1.5rem',
          borderRadius: '0.5rem',
          fontWeight: 500,
          transition: 'all 0.2s',
          textDecoration: 'none',
          border: '1px solid var(--border-primary)',
          background: 'var(--bg-card)',
          color: 'var(--text-primary)',
        }"
      >
        <span>{{ aboutLink?.label || 'About' }}</span>
        <ArrowRight :size="18" />
      </router-link>
    </div>
  </main>

  <div class="container" style="padding-top: 2rem; padding-bottom: 2rem; position: relative; z-index: 10">
    <AppFooter />
  </div>
</template>
