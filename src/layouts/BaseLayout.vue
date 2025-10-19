<template>
  <div class="min-h-screen flex flex-col">
    <AppHeader />

    <main class="flex-1">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <slot />
      </div>
    </main>

    <AppFooter />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import AppHeader from '../components/pagination/AppHeader.vue'
import AppFooter from '../components/pagination/AppFooter.vue'

const currentYear = computed(() => new Date().getFullYear())
</script>
