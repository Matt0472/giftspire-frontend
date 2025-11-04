<template>
  <div class="min-h-screen flex flex-col bg-gradient-to-b from-gray-50 to-white dark:from-gray-800 dark:to-gray-900 text-gray-900 dark:text-gray-100 overflow-x-hidden">
    <AppHeader />

    <main class="flex-1 overflow-x-hidden">
      <div v-if="isFullWidthPage" class="mt-16">
        <slot />
      </div>
      <div v-else class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 mt-16">
        <slot />
      </div>
    </main>

    <AppFooter />

    <!-- Toast Container -->
    <ToastContainer />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import AppHeader from '../components/pagination/AppHeader.vue'
import AppFooter from '../components/pagination/AppFooter.vue'
import ToastContainer from '../components/ui/ToastContainer.vue'

const route = useRoute()

const isFullWidthPage = computed(() => {
  const fullWidthPages = ['home', 'login', 'register']
  return fullWidthPages.includes(route.name as string)
})
</script>
