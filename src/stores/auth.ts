import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useAuthStore = defineStore('auth', () => {
  const loading = ref(false)
  const isAuthenticated = ref(false)
  const isAdmin = ref(false)
  const user = ref<{ name: string; email: string; image: string } | null>(null)

  return {
    loading,
    isAuthenticated,
    isAdmin,
    user,
  }
})
