import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import type { User } from '@/types/auth'

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null)
  const token = ref<string | null>(null)
  const tokenExpiresAt = ref<string | null>(null)

  // Initialize from localStorage
  const initAuth = () => {
    const storedToken = localStorage.getItem('auth_token')
    const storedUser = localStorage.getItem('auth_user')
    const storedTokenExpiresAt = localStorage.getItem('auth_token_expires_at')

    if (storedToken && storedUser && storedTokenExpiresAt) {
      token.value = storedToken
      user.value = JSON.parse(storedUser)
      tokenExpiresAt.value = storedTokenExpiresAt
    }
  }

  // Computed
  const isAuthenticated = computed(() => !!user.value && !!token.value)

  // Actions
  const login = (userData: User, authToken: string, expiresAt: string) => {
    user.value = userData
    token.value = authToken
    tokenExpiresAt.value = expiresAt
    localStorage.setItem('auth_token', authToken)
    localStorage.setItem('auth_user', JSON.stringify(userData))
    localStorage.setItem('auth_token_expires_at', expiresAt)
  }

  const register = (userData: User, authToken: string, expiresAt: string) => {
    login(userData, authToken, expiresAt)
  }

  const logout = () => {
    user.value = null
    token.value = null
    tokenExpiresAt.value = null
    localStorage.removeItem('auth_token')
    localStorage.removeItem('auth_user')
    localStorage.removeItem('auth_token_expires_at')
  }

  return {
    user,
    token,
    tokenExpiresAt,
    isAuthenticated,
    initAuth,
    login,
    register,
    logout,
  }
})
