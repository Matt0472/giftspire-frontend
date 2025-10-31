<template>
  <div class="min-h-[calc(100vh-200px)] flex items-center justify-center bg-gradient-to-b from-gray-50 to-white dark:from-gray-800 dark:to-gray-900 px-4 py-12">
    <LoginForm @submit="handleLogin" />
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
</script>
