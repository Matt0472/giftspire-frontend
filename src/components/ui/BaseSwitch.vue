<template>
  <div class="flex items-center">
    <button
      type="button"
      role="switch"
      :aria-checked="modelValue"
      :aria-labelledby="labelId"
      :disabled="disabled"
      :class="switchClasses"
      @click="toggle"
    >
      <span
        aria-hidden="true"
        :class="toggleClasses"
      />
    </button>
    <label
      v-if="label"
      :id="labelId"
      :class="labelClasses"
      @click="toggle"
    >
      {{ label }}
    </label>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

export interface BaseSwitchProps {
  modelValue: boolean
  label?: string
  disabled?: boolean
  size?: 'sm' | 'md' | 'lg'
}

const props = withDefaults(defineProps<BaseSwitchProps>(), {
  modelValue: false,
  label: undefined,
  disabled: false,
  size: 'md',
})

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
}>()

// Generate unique ID for accessibility
const labelId = computed(() => `switch-label-${Math.random().toString(36).substr(2, 9)}`)

const toggle = () => {
  if (!props.disabled) {
    emit('update:modelValue', !props.modelValue)
  }
}

const switchClasses = computed(() => {
  const baseClasses =
    'relative inline-flex shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2'

  const sizeClasses = {
    sm: 'h-5 w-9',
    md: 'h-6 w-11',
    lg: 'h-7 w-14',
  }

  const stateClasses = props.modelValue
    ? 'bg-indigo-600 dark:bg-indigo-500'
    : 'bg-gray-200 dark:bg-gray-700'

  const disabledClasses = props.disabled
    ? 'opacity-50 cursor-not-allowed'
    : 'focus:ring-indigo-500'

  return [baseClasses, sizeClasses[props.size], stateClasses, disabledClasses].join(' ')
})

const toggleClasses = computed(() => {
  const baseClasses =
    'pointer-events-none inline-block transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out'

  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-5 w-5',
    lg: 'h-6 w-6',
  }

  const positionClasses = {
    sm: props.modelValue ? 'translate-x-4' : 'translate-x-0',
    md: props.modelValue ? 'translate-x-5' : 'translate-x-0',
    lg: props.modelValue ? 'translate-x-7' : 'translate-x-0',
  }

  return [baseClasses, sizeClasses[props.size], positionClasses[props.size]].join(' ')
})

const labelClasses = computed(() => {
  const baseClasses = 'text-sm text-gray-700 dark:text-gray-300'
  const spacingClasses = 'ml-3'
  const cursorClasses = props.disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'

  return [baseClasses, spacingClasses, cursorClasses].join(' ')
})
</script>
