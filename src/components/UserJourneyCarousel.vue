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

      <!-- Carousel Container -->
      <div class="relative">
        <!-- Carousel Slides -->
        <div class="overflow-hidden rounded-3xl shadow-2xl">
          <div
            class="flex transition-transform duration-500 ease-in-out"
            :style="{ transform: `translateX(-${currentSlide * 100}%)` }"
          >
            <!-- Slide 1: Register -->
            <div class="w-full flex-shrink-0 min-h-[400px]">
              <div class="bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 p-12 md:p-16 h-full">
                <div class="max-w-2xl mx-auto text-center text-white h-full flex flex-col justify-center">
                  <div class="flex items-center justify-center w-24 h-24 bg-white/20 backdrop-blur-sm rounded-3xl mb-8 shadow-xl mx-auto">
                    <UserPlus class="w-12 h-12" />
                  </div>
                  <div class="mb-4">
                    <span class="inline-block px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-sm font-semibold mb-4">
                      {{ $t('userJourney.step') }} 1
                    </span>
                  </div>
                  <h3 class="text-4xl md:text-5xl font-bold mb-6">
                    {{ $t('userJourney.steps.register.title') }}
                  </h3>
                  <p class="text-xl md:text-2xl text-white/90 leading-relaxed">
                    {{ $t('userJourney.steps.register.description') }}
                  </p>
                </div>
              </div>
            </div>

            <!-- Slide 2: Fill Form -->
            <div class="w-full flex-shrink-0 min-h-[400px]">
              <div class="bg-gradient-to-br from-blue-500 via-cyan-500 to-teal-500 p-12 md:p-16 h-full">
                <div class="max-w-2xl mx-auto text-center text-white h-full flex flex-col justify-center">
                  <div class="flex items-center justify-center w-24 h-24 bg-white/20 backdrop-blur-sm rounded-3xl mb-8 shadow-xl mx-auto">
                    <ClipboardList class="w-12 h-12" />
                  </div>
                  <div class="mb-4">
                    <span class="inline-block px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-sm font-semibold mb-4">
                      {{ $t('userJourney.step') }} 2
                    </span>
                  </div>
                  <h3 class="text-4xl md:text-5xl font-bold mb-6">
                    {{ $t('userJourney.steps.fillForm.title') }}
                  </h3>
                  <p class="text-xl md:text-2xl text-white/90 leading-relaxed">
                    {{ $t('userJourney.steps.fillForm.description') }}
                  </p>
                </div>
              </div>
            </div>

            <!-- Slide 3: Get Results -->
            <div class="w-full flex-shrink-0 min-h-[400px]">
              <div class="bg-gradient-to-br from-emerald-500 via-green-500 to-lime-500 p-12 md:p-16 h-full">
                <div class="max-w-2xl mx-auto text-center text-white h-full flex flex-col justify-center">
                  <div class="flex items-center justify-center w-24 h-24 bg-white/20 backdrop-blur-sm rounded-3xl mb-8 shadow-xl mx-auto">
                    <Sparkles class="w-12 h-12" />
                  </div>
                  <div class="mb-4">
                    <span class="inline-block px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-sm font-semibold mb-4">
                      {{ $t('userJourney.step') }} 3
                    </span>
                  </div>
                  <h3 class="text-4xl md:text-5xl font-bold mb-6">
                    {{ $t('userJourney.steps.getResults.title') }}
                  </h3>
                  <p class="text-xl md:text-2xl text-white/90 leading-relaxed">
                    {{ $t('userJourney.steps.getResults.description') }}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Navigation Arrows -->
        <button
          @click="previousSlide"
          :disabled="currentSlide === 0"
          class="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white dark:bg-gray-800 rounded-full shadow-lg flex items-center justify-center transition-all hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
          :class="{ 'opacity-50 cursor-not-allowed': currentSlide === 0 }"
        >
          <ChevronLeft class="w-6 h-6 text-gray-700 dark:text-gray-300" />
        </button>
        <button
          @click="nextSlide"
          :disabled="currentSlide === totalSlides - 1"
          class="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white dark:bg-gray-800 rounded-full shadow-lg flex items-center justify-center transition-all hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
          :class="{ 'opacity-50 cursor-not-allowed': currentSlide === totalSlides - 1 }"
        >
          <ChevronRight class="w-6 h-6 text-gray-700 dark:text-gray-300" />
        </button>

        <!-- Dots Indicator -->
        <div class="flex justify-center gap-3 mt-8">
          <button
            v-for="(slide, index) in totalSlides"
            :key="index"
            @click="goToSlide(index)"
            class="transition-all duration-300"
            :class="[
              currentSlide === index
                ? 'w-12 h-3 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full'
                : 'w-3 h-3 bg-gray-300 dark:bg-gray-600 rounded-full hover:bg-gray-400 dark:hover:bg-gray-500'
            ]"
          >
            <span class="sr-only">Go to slide {{ index + 1 }}</span>
          </button>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { UserPlus, ClipboardList, Sparkles, ChevronLeft, ChevronRight } from 'lucide-vue-next'

const currentSlide = ref(0)
const totalSlides = 3
let autoPlayInterval: number | null = null

const nextSlide = () => {
  if (currentSlide.value < totalSlides - 1) {
    currentSlide.value++
  } else {
    currentSlide.value = 0
  }
}

const previousSlide = () => {
  if (currentSlide.value > 0) {
    currentSlide.value--
  } else {
    currentSlide.value = totalSlides - 1
  }
}

const goToSlide = (index: number) => {
  currentSlide.value = index
  // Reset auto-play timer when manually navigating
  stopAutoPlay()
  startAutoPlay()
}

const startAutoPlay = () => {
  if (autoPlayInterval) return
  autoPlayInterval = window.setInterval(() => {
    nextSlide()
  }, 5000) // Change slide every 5 seconds
}

const stopAutoPlay = () => {
  if (autoPlayInterval) {
    clearInterval(autoPlayInterval)
    autoPlayInterval = null
  }
}

onMounted(() => {
  startAutoPlay()
})

onUnmounted(() => {
  stopAutoPlay()
})
</script>

<style scoped>
/* Ensure smooth transitions */
.transition-transform {
  will-change: transform;
}

/* Add subtle animation to the icons */
@keyframes float {
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-10px);
  }
}

.inline-flex.items-center.justify-center {
  animation: float 3s ease-in-out infinite;
}
</style>
