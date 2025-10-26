<template>
  <div class="relative">
    <!-- Carousel Slides -->
    <div class="overflow-hidden rounded-3xl shadow-2xl">
      <div
        class="flex transition-transform duration-500 ease-in-out"
        :style="{ transform: `translateX(-${currentSlide * 100}%)` }"
      >
        <!-- Render slides using scoped slot if provided -->
        <template v-if="$slots.default">
          <slot :current-slide="currentSlide" />
        </template>

        <!-- Otherwise render slides from data -->
        <template v-else>
          <div
            v-for="(slide, index) in slides"
            :key="index"
            class="w-full flex-shrink-0 min-h-[400px]"
          >
            <div
              class="h-full p-12 md:p-16"
              :class="slide.gradient || 'bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500'"
              :style="slide.backgroundImage ? { backgroundImage: `url(${slide.backgroundImage})`, backgroundSize: 'cover', backgroundPosition: 'center' } : {}"
            >
              <div class="max-w-2xl mx-auto text-center text-white h-full flex flex-col justify-center">
                <!-- Image (if provided) -->
                <img
                  v-if="slide.image"
                  :src="slide.image"
                  :alt="slide.title"
                  class="w-32 h-32 object-contain mx-auto mb-8"
                />

                <!-- Icon (if provided and no image) -->
                <div
                  v-else-if="slide.icon"
                  class="flex items-center justify-center w-24 h-24 bg-white/20 backdrop-blur-sm rounded-3xl mb-8 shadow-xl mx-auto floating-icon"
                >
                  <component :is="slide.icon" class="w-12 h-12" />
                </div>

                <!-- Step Label (optional) -->
                <div v-if="slide.stepLabel" class="mb-4">
                  <span class="inline-block px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-sm font-semibold mb-4">
                    {{ slide.stepLabel }}
                  </span>
                </div>

                <!-- Title -->
                <h3 class="text-4xl md:text-5xl font-bold mb-6">
                  {{ slide.title }}
                </h3>

                <!-- Description -->
                <p class="text-xl md:text-2xl text-white/90 leading-relaxed">
                  {{ slide.description }}
                </p>
              </div>
            </div>
          </div>
        </template>
      </div>
    </div>

    <!-- Navigation Arrows -->
    <button
      v-if="showArrows"
      @click="handleArrowClick('previous')"
      class="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white dark:bg-gray-800 rounded-full shadow-lg flex items-center justify-center transition-all hover:scale-110 z-10"
      :aria-label="previousLabel"
    >
      <ChevronLeft class="w-6 h-6 text-gray-700 dark:text-gray-300" />
    </button>
    <button
      v-if="showArrows"
      @click="handleArrowClick('next')"
      class="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white dark:bg-gray-800 rounded-full shadow-lg flex items-center justify-center transition-all hover:scale-110 z-10"
      :aria-label="nextLabel"
    >
      <ChevronRight class="w-6 h-6 text-gray-700 dark:text-gray-300" />
    </button>

    <!-- Dots Indicator -->
    <div v-if="showDots" class="flex justify-center gap-3 mt-8">
      <button
        v-for="(_, index) in calculatedTotalSlides"
        :key="index"
        @click="goToSlide(index)"
        class="transition-all duration-300"
        :class="[
          currentSlide === index
            ? 'w-12 h-3 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full'
            : 'w-3 h-3 bg-gray-300 dark:bg-gray-600 rounded-full hover:bg-gray-400 dark:hover:bg-gray-500'
        ]"
        :aria-label="`Go to slide ${index + 1}`"
      >
        <span class="sr-only">Go to slide {{ index + 1 }}</span>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch, computed } from 'vue'
import { ChevronLeft, ChevronRight } from 'lucide-vue-next'
import type { Component } from 'vue'

export interface CarouselSlide {
  title: string
  description: string
  stepLabel?: string
  image?: string
  icon?: Component
  gradient?: string
  backgroundImage?: string
}

interface Props {
  slides?: CarouselSlide[]
  totalSlides?: number
  autoPlay?: boolean
  autoPlayDelay?: number
  extendedDelay?: number
  showArrows?: boolean
  showDots?: boolean
  previousLabel?: string
  nextLabel?: string
}

const props = withDefaults(defineProps<Props>(), {
  autoPlay: true,
  autoPlayDelay: 5000,
  extendedDelay: 10000,
  showArrows: true,
  showDots: true,
  previousLabel: 'Previous slide',
  nextLabel: 'Next slide'
})

// Calculate total slides from slides array or use provided totalSlides
const calculatedTotalSlides = computed(() => {
  return props.slides ? props.slides.length : props.totalSlides || 0
})

const emit = defineEmits<{
  slideChange: [index: number]
}>()

const currentSlide = ref(0)
let autoPlayInterval: number | null = null

const nextSlide = () => {
  currentSlide.value = (currentSlide.value + 1) % calculatedTotalSlides.value
  emit('slideChange', currentSlide.value)
}

const previousSlide = () => {
  currentSlide.value = (currentSlide.value - 1 + calculatedTotalSlides.value) % calculatedTotalSlides.value
  emit('slideChange', currentSlide.value)
}

const goToSlide = (index: number) => {
  currentSlide.value = index
  emit('slideChange', currentSlide.value)

  if (props.autoPlay) {
    // Give user more time to read after manual navigation
    stopAutoPlay()
    startAutoPlay(props.extendedDelay)
  }
}

const handleArrowClick = (direction: 'next' | 'previous') => {
  if (direction === 'next') {
    nextSlide()
  } else {
    previousSlide()
  }

  if (props.autoPlay) {
    // Give user more time to read after clicking arrows
    stopAutoPlay()
    startAutoPlay(props.extendedDelay)
  }
}

const startAutoPlay = (delay: number = props.autoPlayDelay) => {
  if (autoPlayInterval) return
  autoPlayInterval = window.setInterval(() => {
    nextSlide()
    // After the extended delay, reset to normal interval
    if (delay !== props.autoPlayDelay) {
      stopAutoPlay()
      startAutoPlay(props.autoPlayDelay)
    }
  }, delay)
}

const stopAutoPlay = () => {
  if (autoPlayInterval) {
    clearInterval(autoPlayInterval)
    autoPlayInterval = null
  }
}

// Watch for prop changes
watch(() => props.autoPlay, (newValue) => {
  if (newValue) {
    startAutoPlay()
  } else {
    stopAutoPlay()
  }
})

onMounted(() => {
  if (props.autoPlay) {
    startAutoPlay()
  }
})

onUnmounted(() => {
  stopAutoPlay()
})

// Expose methods for parent control if needed
defineExpose({
  nextSlide,
  previousSlide,
  goToSlide,
  getCurrentSlide: () => currentSlide.value
})
</script>

<style scoped>
/* Ensure smooth transitions */
.transition-transform {
  will-change: transform;
}

/* Floating icon animation */
@keyframes float {
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-10px);
  }
}

.floating-icon {
  animation: float 3s ease-in-out infinite;
}
</style>
