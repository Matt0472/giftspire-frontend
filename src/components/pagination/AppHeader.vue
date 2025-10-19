<script setup lang="ts">
import { useRouter } from 'vue-router'
import { LogOut, LayoutDashboard } from 'lucide-vue-next'
import { useAuthStore } from '@/stores/auth'
import ThemeToggle from '../ui/ThemeToggle.vue'
import BaseButton from '../ui/BaseButton.vue'

const router = useRouter()
const authStore = useAuthStore()

const handleLogin = () => {
  router.push('/login')
}

const handleSignup = () => {
  router.push('/register')
}

const handleLogout = () => {
  authStore.logout()
  router.push('/')
}

const goToDashboard = () => {
  router.push('/dashboard')
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

          <!-- Authenticated User Menu -->
          <template v-if="authStore.isAuthenticated">
            <div class="flex items-center gap-3">
              <span class="text-sm text-gray-700 dark:text-gray-300 hidden sm:block">
                {{ authStore.user?.name }}
              </span>
              <BaseButton variant="ghost" size="sm" @click="goToDashboard">
                <LayoutDashboard class="w-4 h-4" />
              </BaseButton>
              <BaseButton variant="outline" size="sm" @click="handleLogout">
                <LogOut class="w-4 h-4 mr-2" />
                Logout
              </BaseButton>
            </div>
          </template>

          <!-- Guest Menu -->
          <template v-else>
            <BaseButton variant="outline" size="sm" @click="handleLogin">
              Login
            </BaseButton>
            <BaseButton variant="primary" size="sm" @click="handleSignup">
              Sign Up
            </BaseButton>
          </template>
        </div>
      </div>
    </div>
  </header>
</template>

<style scoped>

</style>
