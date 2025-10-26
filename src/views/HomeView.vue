<template>
  <div>
    <!-- Hero/Jumbotron Section -->
    <div class="relative min-h-[600px] flex items-center justify-center overflow-hidden">
      <!-- Gradient Background -->
      <div class="absolute inset-0 bg-gradient-to-br from-[#4b6cb7] to-[#182848]"></div>

      <!-- Starry Background Animation -->
      <StarryBackground :star-count="150" color="#7c9fe8" speed="slow" :size="{ min: 1, max: 2 }" />
      <StarryBackground :star-count="100" color="#a8c0ff" speed="normal" :size="{ min: 1, max: 3 }" />
      <StarryBackground :star-count="80" color="#6b8dd6" speed="fast" :size="{ min: 0.5, max: 1.5 }" />

      <!-- Content -->
      <div class="relative z-20 text-center px-4 max-w-4xl mx-auto">
        <h1 class="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
          <template v-if="locale === 'en'">
            A Sky Full of <span class="gradient-text">gifts</span><br>{{ t('home.heroTitleLine2') }}
          </template>
          <template v-else>
            Un Universo di <span class="gradient-text">Regali</span><br>{{ t('home.heroTitleLine2') }}
          </template>
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
              class="w-full sm:w-auto px-8 py-4 text-lg !bg-white/10 hover:!bg-white/20 !text-white backdrop-blur-sm"
            >
              {{ t('common.signIn') }}
            </BaseButton>
          </template>
        </div>
      </div>
    </div>

    <!-- How It Works Section -->
    <HowItWorks />

    <!-- User Journey Carousel Section -->
    <UserJourneyCarousel />

    <!-- About GiftSpire Section -->
    <AboutGiftSpire />
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useAuthStore } from '@/stores/auth'
import BaseButton from '@/components/ui/BaseButton.vue'
import StarryBackground from '@/components/ui/StarryBackground.vue'
import HowItWorks from '@/components/HomePage/HowItWorks.vue'
import UserJourneyCarousel from '@/components/HomePage/UserJourneyCarousel.vue'
import AboutGiftSpire from '@/components/HomePage/AboutGiftSpire.vue'

const router = useRouter()
const authStore = useAuthStore()
const { t, locale } = useI18n()
</script>

<style scoped>
.gradient-text {
  background: linear-gradient(90deg, #a8c0ff, #7c9fe8, #ffd1ff, #a8c0ff, #7c9fe8);
  background-size: 300% auto;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  color: transparent;
  animation: gradient-shift 6s ease-in-out infinite;
  display: inline-block;
}

@keyframes gradient-shift {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}
</style>
