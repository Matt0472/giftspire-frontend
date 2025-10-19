<script setup lang="ts">
import { computed } from 'vue'

const currentYear = computed(() => new Date().getFullYear())
</script>

<template>
  <footer class="bg-gray-800 dark:bg-gray-950 text-white">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <p class="text-center text-sm">&copy; {{ currentYear }} GiftSpire. All rights reserved.</p>
    </div>
  </footer>
</template>

<style scoped>

</style>
