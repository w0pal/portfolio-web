<script setup lang="ts">
import { Github, Instagram, Linkedin, Mail } from 'lucide-vue-next'

const socialLinks = [
  { href: 'https://github.com/w0pal', icon: Github, label: 'GitHub' },
  { href: 'https://instagram.com/w0pal', icon: Instagram, label: 'Instagram' },
  { href: 'mailto:w0palphotos@gmail.com', icon: Mail, label: 'Email' },
  { href: 'https://linkedin.com/in/w0pal', icon: Linkedin, label: 'LinkedIn' },
]
</script>

<template>
  <footer>
    <div
      class="animate-fade-in-up animation-delay-400"
      style="display: flex; justify-content: center"
    >
      <a
        v-for="link in socialLinks"
        :key="link.href"
        :href="link.href"
        target="_blank"
        rel="noopener noreferrer"
        :style="{
          padding: '0.5rem',
          borderRadius: '0.5rem',
          color: 'var(--text-muted)',
          transition: 'color 0.2s, background 0.2s',
          display: 'inline-flex',
        }"
        :aria-label="link.label"
      >
        <component :is="link.icon" :size="18" />
      </a>
    </div>
  </footer>
</template>
