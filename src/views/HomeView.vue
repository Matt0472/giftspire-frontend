<template>
  <!-- Hero/Jumbotron Section -->
  <div class="relative min-h-[600px] flex items-center justify-center overflow-hidden">
    <!-- Background Image with Overlay -->
    <div
      class="absolute inset-0 bg-cover bg-center bg-no-repeat"
      style="background-image: url('/hero-bg.jpg')"
    >
      <!-- Dark overlay for better text readability -->
      <div class="absolute inset-0 bg-gradient-to-r from-purple-900/80 to-pink-900/80 dark:from-purple-950/90 dark:to-pink-950/90"></div>
    </div>

    <!-- Content -->
    <div class="relative z-10 text-center px-4 max-w-4xl mx-auto">
      <h1 class="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
        {{ t('home.heroTitle') }}<br>{{ t('home.heroTitleLine2') }}
      </h1>
      <p class="text-xl md:text-2xl text-white/90 mb-10 max-w-2xl mx-auto">
        {{ t('home.heroSubtitle') }}
      </p>

      <!-- Call to Action Buttons -->
      <div class="flex flex-col sm:flex-row items-center justify-center gap-4">
        <template v-if="authStore.isAuthenticated">
          <BaseButton
            variant="primary"
            size="lg"
            @click="router.push('/dashboard')"
            class="w-full sm:w-auto px-8 py-4 text-lg"
          >
            {{ t('common.goToDashboard') }}
          </BaseButton>
        </template>
        <template v-else>
          <BaseButton
            variant="primary"
            size="lg"
            @click="router.push('/register')"
            class="w-full sm:w-auto px-8 py-4 text-lg shadow-xl hover:shadow-2xl transition-shadow"
          >
            {{ t('home.getStartedFree') }}
          </BaseButton>
          <BaseButton
            variant="outline"
            size="lg"
            @click="router.push('/login')"
            class="w-full sm:w-auto px-8 py-4 text-lg bg-white/10 hover:bg-white/20 text-white border-white/30 backdrop-blur-sm"
          >
            {{ t('common.signIn') }}
          </BaseButton>
        </template>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useAuthStore } from '@/stores/auth'
import BaseButton from '@/components/ui/BaseButton.vue'

const router = useRouter()
const authStore = useAuthStore()
const { t } = useI18n()
</script>
