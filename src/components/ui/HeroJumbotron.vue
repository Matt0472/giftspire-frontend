<template>
  <section :class="[
    minHeightClass, 'relative w-full overflow-hidden flex justify-center items-center'
  ]">
    <!-- Full-bleed gradient background -->
    <div class="absolute inset-0" :class="gradientClass"></div>

    <!-- Optional decorative slot for backgrounds (e.g., stars) -->
    <slot name="background" />

    <!-- Content container -->
    <div class="relative z-10 flex items-center" :class="centered ? 'min-h-full' : 'py-10 md:py-16'">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div v-if="centered" class="flex items-center justify-center">
          <slot name="content" />
        </div>
        <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <!-- Left column -->
          <div>
            <slot name="left" />
          </div>
          <!-- Right column -->
          <div>
            <slot name="right" />
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue'

export interface HeroJumbotronProps {
  minHeight?: 'none' | 'sm' | 'md' | 'lg'
  gradientFrom?: string
  gradientTo?: string
  noPadding?: boolean
  centered?: boolean
}

const props = withDefaults(defineProps<HeroJumbotronProps>(), {
  minHeight: 'md',
  gradientFrom: 'from-indigo-600',
  gradientTo: 'to-purple-700',
  noPadding: false,
  centered: false,
})

const minHeightClass = computed(() => {
  switch (props.minHeight) {
    case 'lg':
      return 'min-h-[760px]'
    case 'md':
      return 'min-h-[640px]'
    case 'sm':
      return 'min-h-[520px]'
    default:
      return ''
  }
})

const gradientClass = computed(() => ['bg-gradient-to-br', props.gradientFrom, props.gradientTo].join(' '))
</script>

<style scoped>
</style>
