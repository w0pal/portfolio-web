import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

interface User {
  id: string
  name: string | null
  email: string | null
  image: string | null
  isAdmin: boolean
}

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null)
  const loading = ref(true)

  const isAuthenticated = computed(() => !!user.value)
  const isAdmin = computed(() => user.value?.isAdmin ?? false)

  const provider = computed(() => {
    if (!user.value?.image) return 'Email'
    if (user.value.image.includes('googleusercontent')) return 'Google'
    if (user.value.image.includes('githubusercontent')) return 'GitHub'
    return 'Email'
  })

  async function fetchSession() {
    loading.value = true
    try {
      const res = await fetch('/api/auth/session')
      if (res.ok) {
        const data = await res.json()
        user.value = data.user || null
      } else {
        user.value = null
      }
    } catch {
      user.value = null
    } finally {
      loading.value = false
    }
  }

  function signIn(providerName: string = 'google') {
    window.location.href = `/api/auth/${providerName}`
  }

  async function signOut() {
    try {
      await fetch('/api/auth/logout', { method: 'POST' })
      user.value = null
      window.location.reload()
    } catch {
      // force reload even on error
      window.location.reload()
    }
  }

  return {
    user,
    loading,
    isAuthenticated,
    isAdmin,
    provider,
    fetchSession,
    signIn,
    signOut,
  }
})
