<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { Music, ChevronRight, X } from 'lucide-vue-next'
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
const isStowed = ref(false)
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

    <!-- Unstow button: small pop-up tab fixed to left edge when stowed -->
    <button
      v-if="isStowed"
      @click="isStowed = false"
      class="now-playing-unstow"
      :class="theme.isDarkMode ? 'dark' : 'light'"
      title="Show Now Playing"
    >
      <ChevronRight :size="14" />
    </button>

    <!-- Main bubble wrapper: slides off-screen when stowed -->
    <div class="now-playing-wrapper" :class="{ stowed: isStowed }">

      <!-- Collapsed view wrapper for relative positioning -->
      <div v-if="!isExpanded" style="position: relative;">
        <!-- Collapsed: Music Icon -->
        <button
          @click="isExpanded = true"
          class="now-playing-circle-btn"
          :class="theme.isDarkMode ? 'dark-main' : 'light-main'"
          title="Now Playing"
        >
          <Music :size="20" />
        </button>
        <!-- X popup to stow -->
        <button
          @click.stop="isStowed = true"
          class="now-playing-x-btn"
          title="Hide"
        >
          <X :size="12" />
        </button>
      </div>

      <!-- Expanded: Pill with song info -->
      <div
        v-else
        class="now-playing-pill"
        :class="theme.isDarkMode ? 'dark-main' : 'light-main'"
      >
        <button @click="isExpanded = false" class="now-playing-album-btn" title="Collapse">
          <img
            v-if="track.image"
            :src="track.image"
            :alt="track.name"
            class="now-playing-album-img"
          />
          <div v-else class="now-playing-album-fallback">
            <Music :size="16" />
          </div>
        </button>

        <div class="now-playing-text">
          <span class="now-playing-label" :class="theme.isDarkMode ? 'dark-muted' : 'light-muted'">
            Naufal is listening...
          </span>
          <a
            :href="track.url"
            target="_blank"
            rel="noopener noreferrer"
            class="now-playing-title"
            :class="theme.isDarkMode ? 'dark-link' : 'light-link'"
            :title="track.name"
          >
            {{ track.name }}
          </a>
          <span
            class="now-playing-artist"
            :class="theme.isDarkMode ? 'dark-artist' : 'light-artist'"
            :title="track.artist"
          >
            {{ track.artist }}
          </span>
        </div>
      </div>
    </div>
  </template>
</template>

<style scoped>
/* Wrapper: always fixed at bottom-left, slides away when stowed */
.now-playing-wrapper {
  position: fixed;
  bottom: 1.5rem;
  left: 1.5rem;
  z-index: 50;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  transform: translateX(0);
}

.now-playing-wrapper.stowed {
  transform: translateX(calc(-100% - 1.5rem - 10px));
}

/* Unstow tab: small pop-up tab anchored to left edge */
.now-playing-unstow {
  position: fixed;
  bottom: 2.25rem; /* Centered with where the bubble would be */
  left: 0;
  z-index: 50;
  width: 1.5rem;
  height: 1.5rem;
  border-radius: 0 0.5rem 0.5rem 0; /* tiny rounded tab */
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 2px 0 6px rgba(0, 0, 0, 0.1);
  border: 1px solid var(--border-primary);
  border-left: none;
  transition: transform 0.2s, background 0.2s;
}

.now-playing-unstow:hover {
  transform: translateX(2px);
}

.now-playing-unstow.dark {
  background: rgba(30, 41, 59, 0.95);
  color: #fff;
}

.now-playing-unstow.light {
  background: rgba(255, 255, 255, 0.95);
  color: #1e293b;
}

/* Shared circle button */
.now-playing-circle-btn {
  width: 3rem;
  height: 3rem;
  border-radius: 9999px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  border: 1px solid var(--border-primary);
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
  flex-shrink: 0;
}

.dark-subtle { background: rgba(30, 41, 59, 0.95); color: #9ca3af; }
.light-subtle { background: rgba(255, 255, 255, 0.95); color: #6b7280; }

.dark-main { background: rgba(255, 255, 255, 0.95); color: #1e293b; }
.light-main { background: rgba(30, 41, 59, 0.95); color: #ffffff; }

/* X Popup Button */
.now-playing-x-btn {
  position: absolute;
  top: -0.25rem;
  right: -0.25rem;
  width: 1.25rem;
  height: 1.25rem;
  border-radius: 9999px;
  background: #ef4444; /* red-500 */
  color: white;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  padding: 0;
  transition: transform 0.1s ease;
}
.now-playing-x-btn:hover {
  transform: scale(1.1);
}

/* Expanded pill */
.now-playing-pill {
  display: flex;
  align-items: center;
  padding: 0.5rem 1rem;
  gap: 0.5rem;
  border-radius: 9999px;
  border: 1px solid var(--border-primary);
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
  min-width: 200px;
  max-width: calc(100vw - 3rem);
}

.now-playing-album-btn {
  flex-shrink: 0;
  border: none;
  background: none;
  cursor: pointer;
  padding: 0;
}

.now-playing-album-img {
  width: 2rem;
  height: 2rem;
  border-radius: 9999px;
  object-fit: cover;
}

.now-playing-album-fallback {
  width: 2rem;
  height: 2rem;
  border-radius: 9999px;
  background: var(--badge-bg);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-muted);
}

.now-playing-text {
  display: flex;
  flex-direction: column;
  flex: 1;
  min-width: 0;
}

.now-playing-label { font-size: 0.75rem; }
.dark-muted { color: #6b7280; }
.light-muted { color: #9ca3af; }

.now-playing-title {
  font-size: 0.875rem;
  font-weight: 600;
  text-decoration: none;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.dark-link { color: #0891b2; }
.light-link { color: #22d3ee; }

.now-playing-artist {
  font-size: 0.75rem;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.dark-artist { color: #374151; }
.light-artist { color: #d1d5db; }
</style>
