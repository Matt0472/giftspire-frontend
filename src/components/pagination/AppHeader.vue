<script setup lang="ts">
import ThemeToggle from '../ui/ThemeToggle.vue'
</script>

<template>
  <header class="bg-white dark:bg-gray-900 shadow dark:shadow-gray-700">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
      <div class="flex items-center justify-between">
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">GiftSpire</h1>
        <ThemeToggle />
      </div>
    </div>
  </header>
</template>

<style scoped>

</style>
