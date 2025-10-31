<template>
  <div
    :class="wrapperClasses"
    aria-hidden="true"
  >
    <template v-if="shape === 'rect'">
      <div :class="rectClasses"></div>
    </template>
    <template v-else-if="shape === 'pill'">
      <div :class="pillClasses"></div>
    </template>
    <template v-else-if="shape === 'lines'">
      <div v-for="n in lines" :key="n" :class="lineClasses(n)"></div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

export type SkeletonShape = 'rect' | 'pill' | 'lines'

export interface BaseSkeletonProps {
  shape?: SkeletonShape
  rounded?: string
  lines?: number
  class?: string
  innerClass?: string
}

const props = withDefaults(defineProps<BaseSkeletonProps>(), {
  shape: 'rect',
  rounded: 'rounded-lg',
  lines: 3,
  class: '',
  innerClass: '',
})

const wrapperClasses = computed(() => [
  'animate-pulse',
  props.class,
].filter(Boolean).join(' '))

const baseBg = 'bg-gray-200 dark:bg-gray-700'

const rectClasses = computed(() => [baseBg, props.rounded, props.innerClass].filter(Boolean).join(' '))
const pillClasses = computed(() => [baseBg, 'rounded-full', props.innerClass].filter(Boolean).join(' '))

function lineClasses(n: number) {
  const widthClass = n === 1 ? 'w-5/6' : n === props.lines ? 'w-3/4' : 'w-full'
  return [baseBg, 'h-4', 'mb-2', widthClass, 'rounded'].join(' ')
}
</script>

<style scoped>
/* Inline size styles via :style when used if needed */
</style>
