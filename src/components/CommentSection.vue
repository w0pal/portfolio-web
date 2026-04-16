<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { MessageSquare, Send } from 'lucide-vue-next'

const props = defineProps<{
  slug: string
}>()

const auth = useAuthStore()

interface Comment {
  id: string
  content: string
  createdAt: string
  author: {
    name: string | null
    image: string | null
  }
}

const comments = ref<Comment[]>([])
const newComment = ref('')
const loading = ref(false)
const fetching = ref(true)

async function fetchComments() {
  try {
    const res = await fetch(`/api/blog/${props.slug}/comments`)
    if (res.ok) {
      comments.value = await res.json()
    }
  } catch (error) {
    console.error('Failed to fetch comments', error)
  } finally {
    fetching.value = false
  }
}

async function handleSubmit() {
  if (!newComment.value.trim()) return
  loading.value = true
  try {
    const res = await fetch(`/api/blog/${props.slug}/comments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content: newComment.value }),
    })
    if (res.ok) {
      newComment.value = ''
      fetchComments()
    } else {
      alert('Failed to post comment')
    }
  } catch (error) {
    console.error(error)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchComments()
})
</script>

<template>
  <div :style="{ marginTop: '3rem', paddingTop: '2rem', borderTop: '1px solid var(--border-primary)' }">
    <h3
      :style="{
        fontSize: '1.25rem',
        fontWeight: 700,
        marginBottom: '1.5rem',
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        color: 'var(--text-primary)',
      }"
    >
      <MessageSquare :size="20" />
      Comments ({{ comments.length }})
    </h3>

    <!-- Comment Form -->
    <div style="margin-bottom: 2rem">
      <template v-if="auth.isAuthenticated">
        <div style="display: flex; flex-direction: column; gap: 1rem">
          <div style="display: flex; align-items: center; justify-content: space-between">
            <div style="display: flex; align-items: center; gap: 0.75rem">
              <img
                v-if="auth.user?.image"
                :src="auth.user.image"
                alt="User"
                style="width: 2rem; height: 2rem; border-radius: 9999px"
              />
              <span :style="{ fontSize: '0.875rem', color: 'var(--text-secondary)' }">
                Logged in as <strong>{{ auth.user?.name }}</strong>
              </span>
            </div>
            <button
              @click="auth.signOut()"
              style="
                font-size: 0.875rem;
                color: #ef4444;
                border: none;
                background: none;
                cursor: pointer;
                text-decoration: underline;
              "
            >
              Sign out
            </button>
          </div>

          <form @submit.prevent="handleSubmit" style="position: relative">
            <textarea
              v-model="newComment"
              placeholder="What are your thoughts?"
              :disabled="loading"
              :style="{
                width: '100%',
                padding: '1rem',
                borderRadius: '0.75rem',
                border: '1px solid var(--border-input)',
                background: 'var(--bg-card)',
                color: 'var(--text-primary)',
                outline: 'none',
                resize: 'none',
                height: '8rem',
                fontFamily: 'inherit',
                fontSize: '0.875rem',
              }"
            />
            <button
              type="submit"
              :disabled="loading || !newComment.trim()"
              :style="{
                position: 'absolute',
                bottom: '1rem',
                right: '1rem',
                padding: '0.5rem',
                background: '#2563eb',
                color: '#fff',
                borderRadius: '0.5rem',
                border: 'none',
                cursor: 'pointer',
                opacity: loading || !newComment.trim() ? 0.5 : 1,
              }"
            >
              <Send :size="18" />
            </button>
          </form>
        </div>
      </template>

      <template v-else>
        <div
          :style="{
            padding: '1.5rem',
            background: 'var(--bg-card)',
            borderRadius: '0.75rem',
            textAlign: 'center',
          }"
        >
          <p :style="{ color: 'var(--text-muted)', marginBottom: '1rem' }">
            Sign in to leave a comment
          </p>
          <button
            @click="auth.signIn('google')"
            :style="{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.5rem 1.5rem',
              background: '#fff',
              border: '1px solid #d1d5db',
              color: '#374151',
              borderRadius: '0.5rem',
              cursor: 'pointer',
              fontFamily: 'inherit',
              fontSize: '0.875rem',
            }"
          >
            Sign in with Google
          </button>
        </div>
      </template>
    </div>

    <!-- Comments List -->
    <div style="display: flex; flex-direction: column; gap: 1.5rem">
      <p v-if="fetching" style="text-align: center; color: var(--text-muted)">Loading comments...</p>

      <template v-else-if="comments.length > 0">
        <div v-for="comment in comments" :key="comment.id" class="animate-fade-in-up" style="display: flex; gap: 1rem">
          <div style="flex-shrink: 0">
            <img
              v-if="comment.author.image"
              :src="comment.author.image"
              :alt="comment.author.name || 'User'"
              style="width: 2.5rem; height: 2.5rem; border-radius: 9999px"
            />
            <div
              v-else
              :style="{
                width: '2.5rem',
                height: '2.5rem',
                borderRadius: '9999px',
                background: 'var(--badge-bg)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.125rem',
                fontWeight: 700,
                color: 'var(--text-muted)',
              }"
            >
              {{ (comment.author.name || '?')[0].toUpperCase() }}
            </div>
          </div>
          <div style="flex: 1">
            <div
              :style="{
                background: 'var(--bg-card)',
                padding: '1rem',
                borderRadius: '0.75rem',
                borderTopLeftRadius: 0,
              }"
            >
              <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 0.5rem">
                <span :style="{ fontWeight: 600, color: 'var(--text-primary)' }">
                  {{ comment.author.name || 'Anonymous' }}
                </span>
                <span :style="{ fontSize: '0.75rem', color: 'var(--text-muted)' }">
                  {{ new Date(comment.createdAt).toLocaleDateString() }}
                </span>
              </div>
              <p :style="{ color: 'var(--text-secondary)', overflowWrap: 'break-word' }">
                {{ comment.content }}
              </p>
            </div>
          </div>
        </div>
      </template>

      <p v-else :style="{ textAlign: 'center', color: 'var(--text-muted)', fontStyle: 'italic' }">
        No comments yet. Be the first to share your thoughts!
      </p>
    </div>
  </div>
</template>
