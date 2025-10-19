<template>
  <div class="min-h-[60vh] flex items-center justify-center">
    <RegisterForm @submit="handleRegister" @social-login="handleSocialLogin" />
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import RegisterForm from '@/components/auth/RegisterForm.vue'

const router = useRouter()
const authStore = useAuthStore()

const handleRegister = (data: { name: string; email: string; password: string }) => {
  console.log('Register data:', data)

  // TODO: Replace with actual API call
  // For now, simulate successful registration
  const mockUser = {
    id: '123',
    name: data.name,
    email: data.email,
  }
  const mockToken = 'mock-jwt-token-' + Date.now()

  authStore.register(mockUser, mockToken)

  // Redirect to dashboard
  router.push('/dashboard')
}

const handleSocialLogin = (provider: 'google' | 'apple') => {
  console.log('Social login with:', provider)
  // TODO: Implement social login logic here
  alert(`Social login with ${provider} - Not implemented yet`)
}
</script>
