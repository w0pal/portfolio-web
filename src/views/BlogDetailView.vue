<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import { ArrowLeft, Calendar, Tag, User, ExternalLink } from 'lucide-vue-next'
import { blogPosts, type BlogPost } from '@/data/blog-posts'

const route = useRoute()
const post = ref<BlogPost | null>(null)
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
    .replace(/<img[^>]*>/gi, '<div style="text-align:center;font-size:0.8125rem;color:var(--text-muted);margin-bottom:0.5rem">[Image - view on Medium]</div>')
    .replace(/<figcaption[^>]*>/gi, '<figcaption style="text-align:center;font-size:0.8125rem;color:var(--text-muted);font-style:italic">')
    .replace(/<h3[^>]*>/gi, '<h3 style="font-size:1.125rem;font-weight:600;margin-top:1.5rem;margin-bottom:0.75rem">')
    .replace(/<h4[^>]*>/gi, '<h4 style="font-size:1rem;font-weight:600;margin-top:1rem;margin-bottom:0.5rem">')
    .replace(/<p[^>]*>/gi, '<p style="margin-bottom:1rem;line-height:1.75">')
    .replace(/<a /gi, '<a style="text-decoration:underline;color:var(--accent)" ')
    .replace(/<blockquote[^>]*>/gi, '<blockquote style="border-left:4px solid var(--border-subtle);padding-left:1rem;font-style:italic;margin:1rem 0">')
    .replace(/<ul[^>]*>/gi, '<ul style="list-style:disc inside;margin-bottom:1rem">')
    .replace(/<ol[^>]*>/gi, '<ol style="list-style:decimal inside;margin-bottom:1rem">')
    .replace(/<pre[^>]*>/gi, '<pre style="background:#1e1e2e;color:#cdd6f4;padding:1rem;border-radius:0.5rem;overflow-x:auto;margin:1rem 0;font-size:0.8125rem;font-family:var(--font-mono)">')
    .replace(/<code[^>]*>/gi, '<code style="background:var(--bg-surface);padding:0.125rem 0.375rem;border-radius:0.25rem;font-size:0.8125rem;font-family:var(--font-mono)">')
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

// Find the post by slug from static data
const slug = route.params.slug as string
const found = blogPosts.find((p) => p.slug === slug)
if (found) {
  post.value = found
} else {
  notFound.value = true
}
</script>

<template>
  <div>
    <div v-if="notFound" class="container" style="padding: 3rem 1.5rem; text-align: center">
      <h1 style="font-size: 1.5rem; font-weight: 700; margin-bottom: 1rem">Post Not Found</h1>
      <router-link to="/blog" style="color: var(--accent); text-decoration: underline; font-size: 0.9375rem">
        Back to Blog
      </router-link>
    </div>

    <template v-else-if="post">
      <main class="container" style="padding: 2rem 1.5rem">
        <router-link
          to="/blog"
          class="back-link"
        >
          <ArrowLeft :size="16" />
          <span>Back to Blog</span>
        </router-link>

        <article>
          <div v-if="post.coverImage" class="cover-image">
            <img :src="post.coverImage" :alt="post.title" />
          </div>

          <h1 class="post-title">{{ post.title }}</h1>

          <div class="post-meta">
            <div class="meta-item">
              <User :size="14" />
              <span>{{ post.author || 'Naufal' }}</span>
            </div>
            <div class="meta-item">
              <Calendar :size="14" />
              <span>{{ date }}</span>
            </div>
            <div v-if="post.categories && post.categories.length > 0" class="meta-item">
              <Tag :size="14" />
              <div class="category-list">
                <span v-for="(cat, i) in post.categories" :key="i" class="category-pill">{{ cat }}</span>
              </div>
            </div>
            <span class="source-pill" :class="{ medium: isMedium }">
              {{ isMedium ? 'Medium' : 'Local' }}
            </span>
          </div>

          <div class="post-content">
            <template v-if="isMedium">
              <div class="prose-content" v-html="formattedContent" />
              <div class="fade-overlay" />
              <div class="read-more-card">
                <p>This article was published on Medium. Click below to read the full version.</p>
                <a
                  :href="post.originalLink || '#'"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="read-more-btn"
                >
                  <span>Read full article on Medium</span>
                  <ExternalLink :size="16" />
                </a>
              </div>
            </template>

            <template v-else>
              <div class="prose-content" v-html="formattedContent" />
            </template>
          </div>
        </article>
      </main>
    </template>
  </div>
</template>

<style scoped>
.back-link {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 2rem;
  font-size: 0.8125rem;
  color: var(--text-muted);
  text-decoration: none;
  transition: color 0.15s;
}

.back-link:hover {
  color: var(--text-primary);
}

.cover-image {
  width: 100%;
  height: 18rem;
  border-radius: 0.5rem;
  overflow: hidden;
  margin-bottom: 2rem;
}

.cover-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.post-title {
  font-size: clamp(1.3rem, 4vw, 1.8rem);
  font-weight: 700;
  margin-bottom: 1.25rem;
  line-height: 1.3;
}

.post-meta {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 1rem;
  margin-bottom: 2rem;
  padding-bottom: 2rem;
  border-bottom: 1px solid var(--border-subtle);
  color: var(--text-muted);
  font-size: 0.8125rem;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 0.375rem;
}

.category-list {
  display: flex;
  flex-wrap: wrap;
  gap: 0.375rem;
}

.category-pill {
  padding: 0.0625rem 0.375rem;
  font-size: 0.6875rem;
  border-radius: 999px;
  border: 1px solid var(--border-subtle);
}

.source-pill {
  padding: 0.0625rem 0.375rem;
  font-size: 0.6875rem;
  border-radius: 999px;
  border: 1px solid var(--border-subtle);
}

.source-pill.medium {
  background: #000;
  color: #fff;
  border-color: #333;
}

.post-content {
  position: relative;
  margin-bottom: 2rem;
}

.fade-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 5rem;
  background: linear-gradient(to top, var(--bg-primary), transparent);
  pointer-events: none;
}

.read-more-card {
  margin-top: 2rem;
  padding: 1.5rem;
  border-radius: 0.5rem;
  text-align: center;
  background: var(--bg-surface);
  border: 1px solid var(--border-subtle);
}

.read-more-card p {
  margin-bottom: 1rem;
  color: var(--text-secondary);
  font-size: 0.9375rem;
}

.read-more-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.625rem 1.25rem;
  border-radius: 0.375rem;
  font-size: 0.8125rem;
  font-weight: 500;
  text-decoration: none;
  background: var(--accent);
  color: #fff;
  transition: background 0.15s;
}

.read-more-btn:hover {
  background: var(--accent-hover);
}
</style>
