<template>
  <div class="min-h-[60vh] flex items-center justify-center">
    <LoginForm @submit="handleLogin" @social-login="handleSocialLogin" />
  </div>
</template>

<script setup lang="ts">
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import LoginForm from '@/components/auth/LoginForm.vue'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()

const handleLogin = (data: { email: string; password: string }) => {
  console.log('Login data:', data)

  // TODO: Replace with actual API call
  // For now, simulate successful login
  const mockUser = {
    id: '123',
    name: 'Demo User',
    email: data.email,
  }
  const mockToken = 'mock-jwt-token-' + Date.now()

  authStore.login(mockUser, mockToken)

  // Redirect to intended page or dashboard
  const redirect = route.query.redirect as string || '/dashboard'
  router.push(redirect)
}

const handleSocialLogin = (provider: 'google' | 'apple') => {
  console.log('Social login with:', provider)
  // TODO: Implement social login logic here
  alert(`Social login with ${provider} - Not implemented yet`)
}
</script>
