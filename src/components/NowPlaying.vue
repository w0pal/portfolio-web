<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { Music } from 'lucide-vue-next'

const props = defineProps<{
  username: string
  apiKey: string
}>()

interface Track {
  name: string
  artist: string
  album?: string
  image?: string
  url?: string
  nowplaying?: boolean
}

const track = ref<Track | null>(null)
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
  <div class="now-playing-card">
    <div class="now-playing-inner">
      <img
        v-if="track?.image"
        :src="track.image"
        :alt="track?.name"
        class="now-playing-art"
      />
      <div v-else class="now-playing-art-placeholder">
        <Music :size="14" />
      </div>
      <div class="now-playing-info">
        <template v-if="track">
          <span class="now-playing-label">Now playing</span>
          <a
            :href="track.url"
            target="_blank"
            rel="noopener noreferrer"
            class="now-playing-track"
          >{{ track.name }}</a>
          <span class="now-playing-artist">{{ track.artist }}</span>
        </template>
        <template v-else>
          <span class="now-playing-label">Nothing playing</span>
          <span class="now-playing-idle">Check back later</span>
        </template>
      </div>
    </div>
  </div>
</template>

<style scoped>
.now-playing-card {
  padding: 0.5rem 0;
}

.now-playing-inner {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  min-width: 0;
}

.now-playing-art {
  width: 2rem;
  height: 2rem;
  border-radius: 9999px;
  object-fit: cover;
  flex-shrink: 0;
}

.now-playing-art-placeholder {
  width: 2rem;
  height: 2rem;
  border-radius: 9999px;
  background: #21262d;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #8b949e;
  flex-shrink: 0;
}

.now-playing-info {
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.now-playing-label {
  font-size: 0.6875rem;
  color: #8b949e;
}

.now-playing-track {
  font-size: 0.8125rem;
  font-weight: 600;
  color: #58a6ff;
  text-decoration: none;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.now-playing-track:hover {
  color: #79c0ff;
}

.now-playing-artist {
  font-size: 0.6875rem;
  color: #6e7681;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.now-playing-idle {
  font-size: 0.75rem;
  color: #6e7681;
}
</style>
