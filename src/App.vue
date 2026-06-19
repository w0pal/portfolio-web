<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import { useThemeStore } from '@/stores/theme'
import AppHeader from '@/components/AppHeader.vue'

const theme = useThemeStore()
const route = useRoute()

const isAdminRoute = computed(() => route.path.startsWith('/admin'))
const nowPlayingVisible = ref(true)

function toggleNowPlaying() {
  nowPlayingVisible.value = !nowPlayingVisible.value
}

const lastfmUsername = import.meta.env.VITE_LASTFM_USERNAME || ''
const lastfmApiKey = import.meta.env.VITE_LASTFM_API_KEY || ''

onMounted(() => {
  theme.init()
})
</script>

<template>
  <div class="page-wrapper">
    <AppHeader
      v-if="!isAdminRoute"
      :now-playing-visible="nowPlayingVisible"
      :lastfm-username="lastfmUsername"
      :lastfm-api-key="lastfmApiKey"
      @toggle-now-playing="toggleNowPlaying"
    />
    <div class="content-area">
      <router-view v-slot="{ Component }">
        <transition name="page" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </div>
  </div>
</template>

<style>
.page-wrapper {
  min-height: 100vh;
  background-color: var(--bg-primary);
}

/* Desktop: offset content by sidebar width */
@media (min-width: 768px) {
  .content-area {
    margin-left: 14rem;
  }
}

/* Mobile: offset content by mobile header height */
@media (max-width: 767px) {
  .content-area {
    padding-top: 0;
  }
}
</style>
