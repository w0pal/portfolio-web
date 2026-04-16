<script setup lang="ts">
import { onMounted, ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import { useThemeStore } from '@/stores/theme'
import { useAuthStore } from '@/stores/auth'
import AppHeader from '@/components/AppHeader.vue'
import FullscreenMenu from '@/components/FullscreenMenu.vue'
import NowPlayingBubble from '@/components/NowPlayingBubble.vue'

const theme = useThemeStore()
const auth = useAuthStore()
const route = useRoute()
const isMenuOpen = ref(false)

const isAdminRoute = computed(() => route.path.startsWith('/admin'))

const lastfmUsername = import.meta.env.VITE_LASTFM_USERNAME || ''
const lastfmApiKey = import.meta.env.VITE_LASTFM_API_KEY || ''

onMounted(() => {
  theme.init()
  auth.fetchSession()
})
</script>

<template>
  <div class="page-wrapper grid-background glow-effect">
    <AppHeader v-if="!isAdminRoute" :is-menu-open="isMenuOpen" @toggle-menu="isMenuOpen = !isMenuOpen" />
    <FullscreenMenu v-if="!isAdminRoute" :is-open="isMenuOpen" @close="isMenuOpen = false" />
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
