<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { Search } from 'lucide-vue-next'
import AppFooter from '@/components/AppFooter.vue'
import BlogCard from '@/components/BlogCard.vue'

interface BlogPost {
  id: string
  title: string
  slug: string
  description: string | null
  content: string | null
  coverImage: string | null
  source: string
  originalLink: string | null
  createdAt: string
}

const posts = ref<BlogPost[]>([])
const searchQuery = ref('')
const loading = ref(true)

const filteredPosts = computed(() => {
  if (!searchQuery.value.trim()) return posts.value
  const q = searchQuery.value.toLowerCase()
  return posts.value.filter(
    (p) =>
      p.title.toLowerCase().includes(q) ||
      (p.description && p.description.toLowerCase().includes(q))
  )
})

onMounted(async () => {
  try {
    const res = await fetch('/api/blog')
    if (res.ok) {
      posts.value = await res.json()
    }
  } catch (e) {
    console.error('Failed to fetch blog posts', e)
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <main class="container" style="padding: 2rem 1.5rem">
    <!-- Header Section -->
    <div style="margin-bottom: 2.5rem">
      <h1
        class="animate-fade-in-up"
        :style="{
          fontSize: 'clamp(2rem, 5vw, 3rem)',
          fontWeight: 700,
          marginBottom: '0.75rem',
          color: 'var(--text-primary)',
        }"
      >
        Blog
      </h1>
      <p
        class="animate-fade-in-up animation-delay-200"
        :style="{ fontSize: '1rem', color: 'var(--text-muted)' }"
      >
        Tulisan-tulisan dari Medium dan catatan pribadi. Untuk yang lebih personal, cek
        <a
          href="https://www.threads.com/@w0pal"
          target="_blank"
          rel="noopener noreferrer"
          :style="{ textDecoration: 'underline', color: 'var(--text-accent)', transition: 'color 0.2s' }"
        >
          Threads
        </a>
      </p>
    </div>

    <!-- Search Bar -->
    <div class="animate-fade-in-up animation-delay-200" style="margin-bottom: 2rem">
      <div style="position: relative; max-width: 28rem">
        <Search
          :size="20"
          :style="{
            position: 'absolute',
            left: '1rem',
            top: '50%',
            transform: 'translateY(-50%)',
            color: 'var(--text-muted)',
          }"
        />
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Cari artikel..."
          :style="{
            width: '100%',
            paddingLeft: '3rem',
            paddingRight: '1rem',
            paddingTop: '0.75rem',
            paddingBottom: '0.75rem',
            borderRadius: '0.75rem',
            border: '1px solid var(--border-input)',
            background: 'var(--bg-input)',
            color: 'var(--text-primary)',
            outline: 'none',
            fontSize: '0.875rem',
            fontFamily: 'inherit',
            transition: 'border-color 0.2s',
          }"
        />
      </div>
    </div>

    <!-- Loading -->
    <div v-if="loading" style="text-align: center; padding: 5rem; color: var(--text-muted)">
      Loading...
    </div>

    <!-- Posts Grid -->
    <template v-else>
      <div v-if="filteredPosts.length > 0" class="animate-fade-in-up animation-delay-300 blog-grid">
        <BlogCard v-for="post in filteredPosts" :key="post.id" :post="post" />
      </div>
      <div
        v-else
        :style="{ textAlign: 'center', padding: '5rem 0', color: 'var(--text-muted)' }"
      >
        <p style="font-size: 1.125rem">
          {{ searchQuery ? 'Tidak ada artikel yang cocok dengan pencarian.' : 'Belum ada artikel tersedia.' }}
        </p>
      </div>
    </template>
  </main>
  <AppFooter />
</template>

<style scoped>
.blog-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;
}
@media (min-width: 768px) {
  .blog-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
@media (min-width: 1024px) {
  .blog-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}
</style>
