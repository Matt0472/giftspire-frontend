<template>
  <div class="text-center">
    <h1 class="text-4xl font-bold text-gray-900 dark:text-white mb-4">
      Welcome to GiftSpire
    </h1>
    <p class="text-xl text-gray-600 dark:text-gray-300 mb-8">
      Discover the perfect gift for your loved ones
    </p>
    <div class="flex items-center justify-center gap-4">
      <BaseButton variant="primary" size="lg" @click="router.push('/register')">
        Get Started
      </BaseButton>
      <BaseButton variant="outline" size="lg" @click="router.push('/login')">
        Sign In
      </BaseButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import BaseButton from '@/components/ui/BaseButton.vue'

const router = useRouter()
</script>
