<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { ArrowLeft, Calendar, Tag, User, ExternalLink } from 'lucide-vue-next'
import AppFooter from '@/components/AppFooter.vue'
import CommentSection from '@/components/CommentSection.vue'

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
  categories?: string[]
  author?: string
}

const route = useRoute()
const post = ref<BlogPost | null>(null)
const loading = ref(true)
const notFound = ref(false)

const isMedium = computed(() => post.value?.source === 'MEDIUM')

const date = computed(() =>
  post.value
    ? new Date(post.value.createdAt).toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      })
    : ''
)

function formatMediumContent(html: string): string {
  return html
    .replace(/<img[^>]*>/gi, '<div style="text-align:center;font-size:0.875rem;color:var(--text-muted);margin-bottom:0.5rem">[Gambar - lihat di Medium]</div>')
    .replace(/<figcaption[^>]*>/gi, '<figcaption style="text-align:center;font-size:0.875rem;color:var(--text-muted);font-style:italic">')
    .replace(/<h3[^>]*>/gi, '<h3 style="font-size:1.25rem;font-weight:600;margin-top:1.5rem;margin-bottom:0.75rem">')
    .replace(/<h4[^>]*>/gi, '<h4 style="font-size:1.125rem;font-weight:600;margin-top:1rem;margin-bottom:0.5rem">')
    .replace(/<p[^>]*>/gi, '<p style="margin-bottom:1rem;line-height:1.75">')
    .replace(/<a /gi, '<a style="text-decoration:underline;color:var(--text-accent)" ')
    .replace(/<blockquote[^>]*>/gi, '<blockquote style="border-left:4px solid var(--border-primary);padding-left:1rem;font-style:italic;margin:1rem 0;opacity:0.8">')
    .replace(/<ul[^>]*>/gi, '<ul style="list-style:disc inside;margin-bottom:1rem">')
    .replace(/<ol[^>]*>/gi, '<ol style="list-style:decimal inside;margin-bottom:1rem">')
    .replace(/<pre[^>]*>/gi, '<pre style="background:#1e1e2e;color:#cdd6f4;padding:1rem;border-radius:0.5rem;overflow-x:auto;margin:1rem 0;font-size:0.875rem">')
    .replace(/<code[^>]*>/gi, '<code style="background:var(--badge-bg);padding:0.125rem 0.25rem;border-radius:0.25rem;font-size:0.875rem">')
}

function truncateHTML(html: string, maxChars: number): string {
  let charCount = 0
  let result = ''
  let i = 0
  const tagStack: string[] = []

  while (i < html.length && charCount < maxChars) {
    if (html[i] === '<') {
      const tagEnd = html.indexOf('>', i)
      if (tagEnd !== -1) {
        const tag = html.slice(i, tagEnd + 1)
        result += tag
        const tagMatch = tag.match(/^<\/?([a-z0-9]+)/i)
        if (tagMatch && !tag.endsWith('/>') && !['br', 'hr', 'img', 'input'].includes(tagMatch[1].toLowerCase())) {
          if (tag[1] !== '/') {
            tagStack.push(tagMatch[1])
          } else {
            tagStack.pop()
          }
        }
        i = tagEnd + 1
        continue
      }
    }
    result += html[i]
    charCount++
    i++
  }

  while (tagStack.length > 0) {
    result += `</${tagStack.pop()}>`
  }

  const fullTextLength = html.replace(/<[^>]*>/g, '').length
  if (fullTextLength > maxChars) {
    result += '...'
  }

  return result
}

const formattedContent = computed(() => {
  if (!post.value?.content) return ''
  if (isMedium.value) {
    return truncateHTML(formatMediumContent(post.value.content), 850)
  }
  return post.value.content
})

onMounted(async () => {
  const slug = route.params.slug as string
  try {
    const res = await fetch(`/api/blog/${slug}`)
    if (res.ok) {
      post.value = await res.json()
    } else {
      notFound.value = true
    }
  } catch (e) {
    console.error('Failed to fetch post', e)
    notFound.value = true
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <!-- Loading -->
  <div v-if="loading" class="container-narrow" style="padding: 3rem 1.5rem">
    <div style="text-align: center; padding: 5rem; color: var(--text-muted)">Loading...</div>
  </div>

  <!-- Not Found -->
  <div v-else-if="notFound" class="container-narrow" style="padding: 3rem 1.5rem; text-align: center">
    <h1 :style="{ fontSize: '2rem', fontWeight: 700, marginBottom: '1rem', color: 'var(--text-primary)' }">
      Post Not Found
    </h1>
    <router-link to="/blog" :style="{ color: 'var(--text-accent)', textDecoration: 'underline' }">
      Back to Blog
    </router-link>
  </div>

  <!-- Post Content -->
  <template v-else-if="post">
    <main class="container-narrow" style="padding: 2rem 1.5rem">
      <!-- Back Button -->
      <router-link
        to="/blog"
        class="animate-fade-in"
        :style="{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.5rem',
          marginBottom: '2rem',
          fontSize: '0.875rem',
          fontWeight: 500,
          color: 'var(--text-muted)',
          textDecoration: 'none',
          transition: 'color 0.2s',
        }"
      >
        <ArrowLeft :size="18" />
        <span>Kembali ke Blog</span>
      </router-link>

      <article class="animate-fade-in-up">
        <!-- Thumbnail -->
        <div v-if="post.coverImage" style="position: relative; width: 100%; height: 20rem; border-radius: 0.75rem; overflow: hidden; margin-bottom: 2rem">
          <img :src="post.coverImage" :alt="post.title" style="width: 100%; height: 100%; object-fit: cover" />
        </div>

        <!-- Title -->
        <h1
          :style="{
            fontSize: 'clamp(1.5rem, 4vw, 2.25rem)',
            fontWeight: 700,
            marginBottom: '1.5rem',
            lineHeight: 1.3,
            color: 'var(--text-primary)',
          }"
        >
          {{ post.title }}
        </h1>

        <!-- Meta Info -->
        <div
          :style="{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            gap: '1rem',
            marginBottom: '2rem',
            paddingBottom: '2rem',
            borderBottom: '1px solid var(--border-primary)',
            color: 'var(--text-muted)',
          }"
        >
          <div style="display: flex; align-items: center; gap: 0.5rem">
            <User :size="16" />
            <span>{{ post.author || 'Naufal' }}</span>
          </div>
          <div style="display: flex; align-items: center; gap: 0.5rem">
            <Calendar :size="16" />
            <span>{{ date }}</span>
          </div>
          <div
            v-if="post.categories && post.categories.length > 0"
            style="display: flex; align-items: center; gap: 0.5rem"
          >
            <Tag :size="16" />
            <div style="display: flex; flex-wrap: wrap; gap: 0.5rem">
              <span
                v-for="(cat, i) in post.categories"
                :key="i"
                :style="{
                  padding: '0.125rem 0.5rem',
                  fontSize: '0.75rem',
                  borderRadius: '9999px',
                  background: 'var(--badge-bg)',
                }"
              >
                {{ cat }}
              </span>
            </div>
          </div>
          <div
            :style="{
              padding: '0.125rem 0.5rem',
              fontSize: '0.75rem',
              borderRadius: '9999px',
              background: isMedium ? '#000' : 'var(--accent-bg)',
              color: isMedium ? '#fff' : 'var(--accent-text)',
            }"
          >
            {{ isMedium ? 'Medium' : 'Local' }}
          </div>
        </div>

        <!-- Content -->
        <div style="position: relative; margin-bottom: 2rem">
          <template v-if="isMedium">
            <div
              class="prose-content"
              :style="{ color: 'var(--text-secondary)' }"
              v-html="formattedContent"
            />
            <!-- Fade overlay -->
            <div
              :style="{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                height: '5rem',
                background: 'linear-gradient(to top, var(--bg-primary), transparent)',
                pointerEvents: 'none',
              }"
            />
            <!-- Read more -->
            <div
              :style="{
                marginTop: '2rem',
                padding: '1.5rem',
                borderRadius: '0.75rem',
                textAlign: 'center',
                background: 'var(--bg-card)',
              }"
            >
              <p :style="{ marginBottom: '1rem', color: 'var(--text-secondary)' }">
                Artikel ini dipublikasikan di Medium. Klik tombol di bawah untuk membaca selengkapnya.
              </p>
              <a
                :href="post.originalLink || '#'"
                target="_blank"
                rel="noopener noreferrer"
                :style="{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.75rem 1.5rem',
                  borderRadius: '0.5rem',
                  fontWeight: 500,
                  transition: 'all 0.2s',
                  textDecoration: 'none',
                  background: 'var(--text-accent)',
                  color: '#fff',
                }"
              >
                <span>Baca Selengkapnya di Medium</span>
                <ExternalLink :size="18" />
              </a>
            </div>
          </template>

          <template v-else>
            <div
              class="prose-content"
              :style="{ color: 'var(--text-secondary)' }"
              v-html="formattedContent"
            />
          </template>
        </div>

        <!-- Comments (local posts only) -->
        <CommentSection v-if="!isMedium" :slug="post.slug" />
      </article>
    </main>

    <AppFooter />
  </template>
</template>
