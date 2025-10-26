<template>
  <div class="min-h-[calc(100vh-200px)] flex items-center justify-center bg-gradient-to-b from-gray-50 to-white dark:from-gray-800 dark:to-gray-900 px-4 py-12">
    <RegisterForm @submit="handleRegister" @social-login="handleSocialLogin" />
  </div>
</template>

<script setup lang="ts">
import { useAuth } from '@/composables/useAuth'
import RegisterForm from '@/components/auth/RegisterForm.vue'
import type { RegisterRequest } from '@/types/auth'

const { register } = useAuth()

const handleRegister = async (data: RegisterRequest) => {
  try {
    await register(data)
  } catch (error) {
    console.error('Registration failed:', error)
  }
}

const handleSocialLogin = (provider: 'google' | 'apple') => {
  console.log('Social login with:', provider)
  // TODO: Implement social login logic here
  alert(`Social login with ${provider} - Not implemented yet`)
}
</script>
