<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useThemeStore } from '@/stores/theme'
import { useAuthStore } from '@/stores/auth'
import AppHeader from '@/components/AppHeader.vue'
import FullscreenMenu from '@/components/FullscreenMenu.vue'
import NowPlayingBubble from '@/components/NowPlayingBubble.vue'

const theme = useThemeStore()
const auth = useAuthStore()
const isMenuOpen = ref(false)

const lastfmUsername = import.meta.env.VITE_LASTFM_USERNAME || ''
const lastfmApiKey = import.meta.env.VITE_LASTFM_API_KEY || ''

onMounted(() => {
  theme.init()
  auth.fetchSession()
})
</script>

<template>
  <div class="page-wrapper grid-background glow-effect">
    <AppHeader :is-menu-open="isMenuOpen" @toggle-menu="isMenuOpen = !isMenuOpen" />
    <FullscreenMenu :is-open="isMenuOpen" @close="isMenuOpen = false" />
    <NowPlayingBubble
      :username="lastfmUsername"
      :api-key="lastfmApiKey"
    />
    <router-view v-slot="{ Component }">
      <transition name="page" mode="out-in">
        <component :is="Component" />
      </transition>
    </router-view>
  </div>
</template>
