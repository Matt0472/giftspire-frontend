<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useAuthStore } from '@/stores/auth'
import BaseButton from '@/components/ui/BaseButton.vue'
import HeroJumbotron from '@/components/ui/HeroJumbotron.vue'
import StarryBackground from '@/components/ui/StarryBackground.vue'

const router = useRouter()
const authStore = useAuthStore()
const { t, locale } = useI18n()
</script>

<template>
  <HeroJumbotron
    minHeight="md"
    gradientFrom="from-[#4b6cb7]"
    gradientTo="to-[#182848]"
    :centered="true"
  >
    <template #background>
      <!-- Starry Background Animation -->
      <StarryBackground :star-count="150" color="#7c9fe8" speed="slow" :size="{ min: 1, max: 2 }" />
      <StarryBackground :star-count="100" color="#a8c0ff" speed="normal" :size="{ min: 1, max: 3 }" />
      <StarryBackground :star-count="80" color="#6b8dd6" speed="fast" :size="{ min: 0.5, max: 1.5 }" />
    </template>

    <template #content>
      <div class="text-center max-w-4xl">
        <h1 class="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
          {{ t('home.heroTitleStart') }}<span class="gradient-text">{{ t('home.heroTitleHighlight') }}</span><br>{{ t('home.heroTitleLine2') }}
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
    </template>
  </HeroJumbotron>
</template>

<style scoped></style>
