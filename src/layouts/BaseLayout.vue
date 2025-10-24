<template>
  <div class="min-h-screen flex flex-col bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
    <AppHeader />

    <main class="flex-1">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <slot />
      </div>
    </main>

    <AppFooter />

    <!-- Toast Container -->
    <ToastContainer />
  </div>
</template>

<script setup lang="ts">
import AppHeader from '../components/pagination/AppHeader.vue'
import AppFooter from '../components/pagination/AppFooter.vue'
import ToastContainer from '../components/ui/ToastContainer.vue'
</script>
