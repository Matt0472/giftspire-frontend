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
      // Step 1: Get access token from login
      const token = await authAPI.login(credentials)

      // Step 2: Fetch current user data using the token
      // First, temporarily store token so the API client can use it
      authStore.login({ id: '', name: '', email: '' }, token)

      try {
        // Step 3: Get user data (requires verified email)
        const user = await authAPI.getCurrentUser()

        // Step 4: Store complete auth data
        authStore.login(user, token)

        await router.push('/dashboard')
        return { user, token }
      } catch (userErr: unknown) {
        // If getCurrentUser fails (likely due to unverified email)
        // Keep the token but redirect to verification page
        const responseStatus = (userErr as { response?: { status?: number } }).response?.status
        if (responseStatus === 403 || responseStatus === 401) {
          error.value = 'Please verify your email address to continue.'
          await router.push('/verify-email-pending')
          return { user: null, token }
        }
        throw userErr
      }
    } catch (err: unknown) {
      const errorMessage = (err as { response?: { data?: { message?: string } } }).response?.data?.message
      error.value = errorMessage || 'Login failed. Please try again.'
      authStore.logout() // Clear any partial data on error
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const register = async (userData: RegisterRequest) => {
    isLoading.value = true
    error.value = null

    try {
      // Backend returns 204 No Content on successful registration
      // and sends verification email to the user
      await authAPI.register(userData)

      // Registration successful - redirect to verification pending page
      // User needs to check email and verify before logging in
      await router.push('/verify-email-pending')

      return { success: true }
    } catch (err: unknown) {
      const errorMessage = (err as { response?: { data?: { message?: string } } }).response?.data?.message
      error.value = errorMessage || 'Registration failed. Please try again.'
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
    } catch (err: unknown) {
      const errorMessage = (err as { response?: { data?: { message?: string } } }).response?.data?.message
      error.value = errorMessage || 'Failed to fetch user data.'
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
