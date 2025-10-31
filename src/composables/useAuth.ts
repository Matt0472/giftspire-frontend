import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { authAPI } from '@/api/auth'
import type { LoginRequest, RegisterRequest } from '@/types/auth'
import { useToastStore } from '@/stores/toast'

export function useAuth() {
  const authStore = useAuthStore()
  const router = useRouter()
  const toast = useToastStore()
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  const login = async (credentials: LoginRequest) => {
    isLoading.value = true
    error.value = null

    try {
      const token = await authAPI.login(credentials)

      localStorage.setItem('auth_token', token);

    } catch (err: unknown) {
      const errorMessage = (err as { response?: { data?: { message?: string } } }).response?.data?.message
      const message = errorMessage || 'Login failed. Please try again.'
      error.value = message
      // Surface error to customer via toast
      toast.error(message, 'Login failed')
      isLoading.value = false
      throw err
    }

    try {
      // Step 3: Get user data
      const user = await authAPI.getCurrentUser()
      const token = localStorage.getItem('auth_token');

      if (!user || !token) {
        throw new Error('User data or token is missing')
      }

      authStore.login(user, token)
    } catch (userErr: unknown) {
      const errorMessage = (userErr as { response?: { data?: { message?: string } } }).response?.data?.message
      const message = errorMessage || 'We could not load your account. Please try again.'
      error.value = message
      toast.error(message, 'Login failed')
      isLoading.value = false
      throw userErr
    }
    isLoading.value = false
    await router.push('/dashboard')
  }

  const register = async (userData: RegisterRequest) => {
    isLoading.value = true
    error.value = null

    try {
      await authAPI.register(userData)

      await router.push({
        name: 'login',
        query: { registered: 'true' }
      })

    } catch (err: unknown) {
      const errorMessage = (err as { response?: { data?: { message?: string } } }).response?.data?.message
      const message = errorMessage || 'Registration failed. Please try again.'
      error.value = message
      toast.error(message, 'Registration failed')
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
  }
}
