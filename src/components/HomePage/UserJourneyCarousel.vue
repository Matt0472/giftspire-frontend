<template>
  <section class="py-20 px-4 bg-gradient-to-b from-gray-50 to-white dark:from-gray-800 dark:to-gray-900">
    <div class="max-w-6xl mx-auto">
      <!-- Section Header -->
      <div class="text-center mb-16">
        <h2 class="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
          {{ $t('userJourney.title') }}
        </h2>
        <p class="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
          {{ $t('userJourney.subtitle') }}
        </p>
      </div>

      <!-- Carousel -->
      <BaseCarousel :slides="carouselSlides" :auto-play="true" />
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { UserPlus, ClipboardList, Sparkles } from 'lucide-vue-next'
import BaseCarousel, { type CarouselSlide } from '@/components/ui/BaseCarousel.vue'

const { t } = useI18n()

const carouselSlides = computed<CarouselSlide[]>(() => [
  {
    title: t('userJourney.steps.register.title'),
    description: t('userJourney.steps.register.description'),
    stepLabel: `${t('userJourney.step')} 1`,
    icon: UserPlus,
    gradient: 'bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500'
  },
  {
    title: t('userJourney.steps.fillForm.title'),
    description: t('userJourney.steps.fillForm.description'),
    stepLabel: `${t('userJourney.step')} 2`,
    icon: ClipboardList,
    gradient: 'bg-gradient-to-br from-blue-500 via-cyan-500 to-teal-500'
  },
  {
    title: t('userJourney.steps.getResults.title'),
    description: t('userJourney.steps.getResults.description'),
    stepLabel: `${t('userJourney.step')} 3`,
    icon: Sparkles,
    gradient: 'bg-gradient-to-br from-emerald-500 via-green-500 to-lime-500'
  }
])
</script>
