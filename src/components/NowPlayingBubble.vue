<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { Music } from 'lucide-vue-next'
import { useThemeStore } from '@/stores/theme'

const props = defineProps<{
  username: string
  apiKey: string
}>()

const theme = useThemeStore()

interface Track {
  name: string
  artist: string
  album?: string
  image?: string
  url?: string
  nowplaying?: boolean
}

const track = ref<Track | null>(null)
const isExpanded = ref(false)
let interval: ReturnType<typeof setInterval> | null = null

async function fetchNowPlaying() {
  if (!props.username || !props.apiKey) return
  try {
    const url = `https://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user=${props.username}&api_key=${props.apiKey}&format=json&limit=1`
    const res = await fetch(url)
    const data = await res.json()
    const recent = data.recenttracks?.track?.[0]
    if (recent && recent['@attr']?.nowplaying) {
      track.value = {
        name: recent.name,
        artist: recent.artist['#text'],
        album: recent.album['#text'],
        image: recent.image?.[2]?.['#text'] || '',
        url: recent.url,
        nowplaying: true,
      }
    } else {
      track.value = null
    }
  } catch {
    track.value = null
  }
}

onMounted(() => {
  fetchNowPlaying()
  interval = setInterval(fetchNowPlaying, 30_000)
})

onUnmounted(() => {
  if (interval) clearInterval(interval)
})
</script>

<template>
  <template v-if="track">
    <!-- Collapsed -->
    <button
      v-if="!isExpanded"
      @click="isExpanded = true"
      class="animate-fade-in-up"
      :style="{
        position: 'fixed',
        bottom: '1.5rem',
        right: '1.5rem',
        zIndex: 50,
        width: '3rem',
        height: '3rem',
        borderRadius: '9999px',
        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
        border: '1px solid var(--border-primary)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        transition: 'transform 0.2s',
        background: theme.isDarkMode ? 'rgba(255,255,255,0.95)' : 'rgba(30,41,59,0.95)',
        color: theme.isDarkMode ? '#1e293b' : '#ffffff',
      }"
    >
      <Music :size="20" />
    </button>

    <!-- Expanded -->
    <div
      v-else
      class="animate-fade-in-up"
      :style="{
        position: 'fixed',
        bottom: '1.5rem',
        right: '1.5rem',
        zIndex: 50,
        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
        borderRadius: '9999px',
        display: 'flex',
        alignItems: 'center',
        padding: '0.5rem 1rem',
        gap: '0.5rem',
        border: '1px solid var(--border-primary)',
        minWidth: '200px',
        background: theme.isDarkMode ? 'rgba(255,255,255,0.95)' : 'rgba(30,41,59,0.95)',
      }"
    >
      <button @click="isExpanded = false" style="flex-shrink: 0; border: none; background: none; cursor: pointer; padding: 0">
        <img
          v-if="track.image"
          :src="track.image"
          :alt="track.name"
          style="width: 2rem; height: 2rem; border-radius: 9999px; object-fit: cover"
        />
        <div
          v-else
          style="
            width: 2rem;
            height: 2rem;
            border-radius: 9999px;
            background: var(--badge-bg);
            display: flex;
            align-items: center;
            justify-content: center;
          "
        >
          <Music :size="16" />
        </div>
      </button>
      <div style="display: flex; flex-direction: column; flex: 1; min-width: 0">
        <span
          :style="{
            fontSize: '0.75rem',
            color: theme.isDarkMode ? '#6b7280' : '#9ca3af',
          }"
        >
          Naufal is listening...
        </span>
        <a
          :href="track.url"
          target="_blank"
          rel="noopener noreferrer"
          class="truncate"
          :style="{
            fontSize: '0.875rem',
            fontWeight: 600,
            color: theme.isDarkMode ? '#0891b2' : '#22d3ee',
            textDecoration: 'none',
          }"
          :title="track.name"
        >
          {{ track.name }}
        </a>
        <span
          class="truncate"
          :style="{
            fontSize: '0.75rem',
            color: theme.isDarkMode ? '#374151' : '#d1d5db',
          }"
          :title="track.artist"
        >
          {{ track.artist }}
        </span>
      </div>
    </div>
  </template>
</template>
