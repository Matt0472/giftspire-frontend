<template>
  <div class="min-h-[60vh] flex items-center justify-center">
    <LoginForm @submit="handleLogin" @social-login="handleSocialLogin" />
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import LoginForm from '@/components/auth/LoginForm.vue'

const router = useRouter()

const handleLogin = (data: { email: string; password: string }) => {
  console.log('Login data:', data)
  // TODO: Implement actual login logic here
  // For now, just log the data
  alert(`Login attempt with email: ${data.email}`)
}

const handleSocialLogin = (provider: 'google' | 'apple') => {
  console.log('Social login with:', provider)
  // TODO: Implement social login logic here
  alert(`Social login with ${provider}`)
}
</script>
