<script setup lang="ts">
import { useRouter } from 'vue-router'
import ThemeToggle from '../ui/ThemeToggle.vue'
import BaseButton from '../ui/BaseButton.vue'

const router = useRouter()

const handleLogin = () => {
  router.push('/login')
}

const handleSignup = () => {
  router.push('/register')
}
</script>

<template>
  <header class="bg-white dark:bg-gray-900 shadow dark:shadow-gray-700">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
      <div class="flex items-center justify-between">
        <router-link to="/">
          <h1 class="text-2xl font-bold text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer">
            GiftSpire
          </h1>
        </router-link>

        <div class="flex items-center gap-3">
          <ThemeToggle />
          <div class="border-l border-gray-300 dark:border-gray-600 h-8 mx-1"></div>
          <BaseButton variant="outline" size="sm" @click="handleLogin">
            Login
          </BaseButton>
          <BaseButton variant="primary" size="sm" @click="handleSignup">
            Sign Up
          </BaseButton>
        </div>
      </div>
    </div>
  </header>
</template>

<style scoped>

</style>
