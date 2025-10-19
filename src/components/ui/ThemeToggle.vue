<template>
  <button
    @click="toggleTheme"
    class="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
    :aria-label="`Switch to ${isDark ? 'light' : 'dark'} mode`"
  >
    <Sun v-if="isDark" class="w-6 h-6 text-gray-900 dark:text-gray-100" />
    <Moon v-else class="w-6 h-6 text-gray-900 dark:text-gray-100" />
  </button>
</template>

<script setup lang="ts">
import { Sun, Moon } from 'lucide-vue-next'
import { useTheme } from '@/composables/useTheme'

const { isDark, toggleTheme } = useTheme()
</script>
