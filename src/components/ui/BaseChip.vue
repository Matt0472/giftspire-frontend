<template>
  <component
    :is="asTag"
    :type="asTag === 'button' ? 'button' : undefined"
    :href="asTag === 'a' ? href : undefined"
    :target="asTag === 'a' ? target : undefined"
    :rel="asTag === 'a' ? computedRel : undefined"
    :disabled="disabled || undefined"
    :class="wrapperClasses"
    @click="onClick"
    @keydown.enter.prevent="onClick"
  >
    <span :class="innerClasses">
      <slot>{{ label }}</slot>
    </span>
  </component>
</template>

<script setup lang="ts">
import { computed } from 'vue'

export type ChipVariant = 'accent1' | 'accent2' | 'accent3'
export type ChipSize = 'sm' | 'md'

export interface BaseChipProps {
  label?: string
  variant?: ChipVariant
  size?: ChipSize
  disabled?: boolean
  as?: 'button' | 'a'
  href?: string
  target?: '_self' | '_blank' | '_parent' | '_top'
  rel?: string
}

const props = withDefaults(defineProps<BaseChipProps>(), {
  label: '',
  variant: 'accent1',
  size: 'md',
  disabled: false,
  as: 'button',
  href: '',
  target: '_self',
  rel: 'noopener noreferrer',
})

const emit = defineEmits<{
  click: [event: MouseEvent]
}>()

const asTag = computed(() => (props.as === 'a' && props.href ? 'a' : 'button'))

const wrapperClasses = computed(() => {
  const base = 'inline-flex rounded-full p-[2px] focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500'
  const variantMap: Record<ChipVariant, string> = {
    accent1: 'animated-gradient-border--accent1',
    accent2: 'animated-gradient-border--accent2',
    accent3: 'animated-gradient-border--accent3',
  }
  return [base, variantMap[props.variant]].join(' ')
})

const innerClasses = computed(() => {
  const base = 'rounded-full bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100 font-medium transition-colors'
  const interactive = props.disabled
    ? 'opacity-60 cursor-not-allowed'
    : 'hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer'
  const sizes: Record<ChipSize, string> = {
    sm: 'px-3 py-1 text-xs',
    md: 'px-4 py-2 text-sm',
  }
  return [base, interactive, sizes[props.size]].join(' ')
})

const computedRel = computed(() => {
  const defaults = ['noopener', 'noreferrer']
  const custom = (props.rel || '').split(/\s+/).filter(Boolean)
  return Array.from(new Set([...defaults, ...custom])).join(' ')
})

function onClick(event: MouseEvent) {
  if (props.disabled) return
  emit('click', event)
}
</script>

<style scoped>
</style>
