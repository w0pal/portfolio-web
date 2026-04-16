import { defineStore } from 'pinia'
import { ref, computed, watch, onMounted } from 'vue'

export type ThemeMode = 'system' | 'light' | 'dark'

export const useThemeStore = defineStore('theme', () => {
  const themeMode = ref<ThemeMode>('system')
  const systemPrefersDark = ref(false)
  const mounted = ref(false)

  const isDarkMode = computed(() => {
    if (themeMode.value === 'system') return systemPrefersDark.value
    return themeMode.value === 'dark'
  })

  function setTheme(mode: ThemeMode) {
    themeMode.value = mode
    localStorage.setItem('theme', mode)
    applyTheme()
  }

  function cycleTheme() {
    if (themeMode.value === 'light') setTheme('dark')
    else if (themeMode.value === 'dark') setTheme('system')
    else setTheme('light')
  }

  function applyTheme() {
    const dark = isDarkMode.value
    document.documentElement.setAttribute('data-theme', dark ? 'dark' : 'light')

    // Update theme-color meta tags
    const metas = document.querySelectorAll('meta[name="theme-color"]')
    const color = dark ? '#1e293b' : '#ffffff'
    metas.forEach((m) => m.setAttribute('content', color))

    // Update apple status bar
    const appleStatusBar = document.querySelector(
      'meta[name="apple-mobile-web-app-status-bar-style"]'
    )
    if (appleStatusBar) {
      appleStatusBar.setAttribute('content', dark ? 'black-translucent' : 'default')
    }
  }

  function init() {
    // Read from localStorage
    const saved = localStorage.getItem('theme') as ThemeMode | null
    if (saved && ['system', 'light', 'dark'].includes(saved)) {
      themeMode.value = saved
    }

    // Check system preference
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    systemPrefersDark.value = mediaQuery.matches

    mediaQuery.addEventListener('change', (e) => {
      systemPrefersDark.value = e.matches
      if (themeMode.value === 'system') {
        applyTheme()
      }
    })

    applyTheme()
    mounted.value = true
  }

  // Watch for reactive changes
  watch(isDarkMode, () => {
    applyTheme()
  })

  return {
    themeMode,
    isDarkMode,
    mounted,
    setTheme,
    cycleTheme,
    init,
  }
})
