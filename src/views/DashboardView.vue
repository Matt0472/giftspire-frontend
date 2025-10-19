<template>
  <div>
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-2">
        Welcome back, {{ authStore.user?.name }}!
      </h1>
      <p class="text-gray-600 dark:text-gray-300">
        This is your personalized dashboard
      </p>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <!-- Stats Card 1 -->
      <div class="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Profile</h3>
          <User class="w-6 h-6 text-blue-500" />
        </div>
        <p class="text-gray-600 dark:text-gray-300 text-sm mb-2">
          Email: {{ authStore.user?.email }}
        </p>
        <p class="text-gray-600 dark:text-gray-300 text-sm">
          User ID: {{ authStore.user?.id }}
        </p>
      </div>

      <!-- Stats Card 2 -->
      <div class="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Quick Stats</h3>
          <BarChart class="w-6 h-6 text-green-500" />
        </div>
        <p class="text-3xl font-bold text-gray-900 dark:text-white">0</p>
        <p class="text-gray-600 dark:text-gray-300 text-sm">Total Items</p>
      </div>

      <!-- Stats Card 3 -->
      <div class="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Settings</h3>
          <Settings class="w-6 h-6 text-purple-500" />
        </div>
        <BaseButton variant="outline" size="sm" @click="handleLogout">
          Logout
        </BaseButton>
      </div>
    </div>

    <div class="mt-8 bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg">
      <h2 class="text-xl font-bold text-gray-900 dark:text-white mb-4">
        Recent Activity
      </h2>
      <p class="text-gray-600 dark:text-gray-300">
        No recent activity to display.
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { User, BarChart, Settings } from 'lucide-vue-next'
import { useAuthStore } from '@/stores/auth'
import BaseButton from '@/components/ui/BaseButton.vue'

const router = useRouter()
const authStore = useAuthStore()

const handleLogout = () => {
  authStore.logout()
  router.push('/login')
}
</script>
