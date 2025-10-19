<template>
  <div class="min-h-[60vh] flex items-center justify-center">
    <LoginForm @submit="handleLogin" @social-login="handleSocialLogin" />
  </div>
</template>

<script setup lang="ts">
import { useAuth } from '@/composables/useAuth'
import LoginForm from '@/components/auth/LoginForm.vue'
import type { LoginRequest } from '@/types/auth'

const { login } = useAuth()

const handleLogin = async (data: LoginRequest) => {
  try {
    await login(data)
  } catch (error) {
    console.error('Login failed:', error)
  }
}

const handleSocialLogin = (provider: 'google' | 'apple') => {
  console.log('Social login with:', provider)
  // TODO: Implement social login logic here
  alert(`Social login with ${provider} - Not implemented yet`)
}
</script>
