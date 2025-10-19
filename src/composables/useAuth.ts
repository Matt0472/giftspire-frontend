import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { authAPI } from '@/api/auth'
import type { LoginRequest, RegisterRequest } from '@/types/auth'

export function useAuth() {
  const authStore = useAuthStore()
  const router = useRouter()
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  const login = async (credentials: LoginRequest) => {
    isLoading.value = true
    error.value = null

    try {
      const response = await authAPI.login(credentials)
      authStore.login(response.user, response.token)
      await router.push('/dashboard')
      return response
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Login failed. Please try again.'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const register = async (userData: RegisterRequest) => {
    isLoading.value = true
    error.value = null

    try {
      const response = await authAPI.register(userData)
      authStore.register(response.user, response.token)
      await router.push('/dashboard')
      return response
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Registration failed. Please try again.'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const logout = async () => {
    isLoading.value = true
    error.value = null

    try {
      await authAPI.logout()
    } catch (err) {
      console.error('Logout API call failed:', err)
    } finally {
      authStore.logout()
      await router.push('/login')
      isLoading.value = false
    }
  }

  const fetchCurrentUser = async () => {
    isLoading.value = true
    error.value = null

    try {
      const user = await authAPI.getCurrentUser()
      if (authStore.token) {
        authStore.login(user, authStore.token)
      }
      return user
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to fetch user data.'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  return {
    // State
    user: authStore.user,
    token: authStore.token,
    isAuthenticated: authStore.isAuthenticated,
    isLoading,
    error,

    // Actions
    login,
    register,
    logout,
    fetchCurrentUser
  }
}
