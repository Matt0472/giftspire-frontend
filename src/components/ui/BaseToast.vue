<template>
  <transition
    enter-active-class="transition ease-out duration-300"
    enter-from-class="opacity-0 translate-y-2"
    enter-to-class="opacity-100 translate-y-0"
    leave-active-class="transition ease-in duration-200"
    leave-from-class="opacity-100 translate-y-0"
    leave-to-class="opacity-0 translate-y-2"
  >
    <div
      v-if="visible"
      :class="toastClasses"
      class="flex items-start p-4 rounded-lg shadow-lg border"
      role="alert"
    >
      <!-- Icon -->
      <div class="flex-shrink-0">
        <component :is="iconComponent" :class="iconClasses" class="w-5 h-5" />
      </div>

      <!-- Content -->
      <div class="ml-3 flex-1">
        <p v-if="title" :class="titleClasses" class="text-sm font-semibold">
          {{ title }}
        </p>
        <p :class="messageClasses" class="text-sm">
          {{ message }}
        </p>
      </div>

      <!-- Close Button -->
      <button
        v-if="dismissible"
        type="button"
        :class="closeButtonClasses"
        class="ml-3 flex-shrink-0 inline-flex rounded-md hover:opacity-75 focus:outline-none focus:ring-2 focus:ring-offset-2"
        @click="dismiss"
      >
        <span class="sr-only">Close</span>
        <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path
            fill-rule="evenodd"
            d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
            clip-rule="evenodd"
          />
        </svg>
      </button>
    </div>
  </transition>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, h } from 'vue'

export interface BaseToastProps {
  variant?: 'info' | 'warning' | 'error' | 'success'
  title?: string
  message: string
  dismissible?: boolean
  autoClose?: boolean
  duration?: number // milliseconds
}

const props = withDefaults(defineProps<BaseToastProps>(), {
  variant: 'info',
  dismissible: true,
  autoClose: true,
  duration: 5000,
})

const emit = defineEmits<{
  close: []
}>()

const visible = ref(true)
let autoCloseTimer: ReturnType<typeof setTimeout> | null = null

// Icon components
const InfoIcon = () =>
  h(
    'svg',
    {
      fill: 'currentColor',
      viewBox: '0 0 20 20',
      xmlns: 'http://www.w3.org/2000/svg',
    },
    [
      h('path', {
        'fill-rule': 'evenodd',
        d: 'M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z',
        'clip-rule': 'evenodd',
      }),
    ]
  )

const WarningIcon = () =>
  h(
    'svg',
    {
      fill: 'currentColor',
      viewBox: '0 0 20 20',
      xmlns: 'http://www.w3.org/2000/svg',
    },
    [
      h('path', {
        'fill-rule': 'evenodd',
        d: 'M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z',
        'clip-rule': 'evenodd',
      }),
    ]
  )

const ErrorIcon = () =>
  h(
    'svg',
    {
      fill: 'currentColor',
      viewBox: '0 0 20 20',
      xmlns: 'http://www.w3.org/2000/svg',
    },
    [
      h('path', {
        'fill-rule': 'evenodd',
        d: 'M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z',
        'clip-rule': 'evenodd',
      }),
    ]
  )

const SuccessIcon = () =>
  h(
    'svg',
    {
      fill: 'currentColor',
      viewBox: '0 0 20 20',
      xmlns: 'http://www.w3.org/2000/svg',
    },
    [
      h('path', {
        'fill-rule': 'evenodd',
        d: 'M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z',
        'clip-rule': 'evenodd',
      }),
    ]
  )

const iconComponent = computed(() => {
  const icons = {
    info: InfoIcon,
    warning: WarningIcon,
    error: ErrorIcon,
    success: SuccessIcon,
  }
  return icons[props.variant]
})

const toastClasses = computed(() => {
  const variants = {
    info: 'bg-blue-50 border-blue-200 dark:bg-blue-900/80 dark:border-blue-800',
    warning: 'bg-yellow-50 border-yellow-200 dark:bg-yellow-900/80 dark:border-yellow-800',
    error: 'bg-red-50 border-red-200 dark:bg-red-900/80 dark:border-red-800',
    success: 'bg-green-50 border-green-200 dark:bg-green-900/80 dark:border-green-800',
  }
  return variants[props.variant]
})

const iconClasses = computed(() => {
  const variants = {
    info: 'text-blue-600 dark:text-blue-400',
    warning: 'text-yellow-600 dark:text-yellow-400',
    error: 'text-red-600 dark:text-red-400',
    success: 'text-green-600 dark:text-green-400',
  }
  return variants[props.variant]
})

const titleClasses = computed(() => {
  const variants = {
    info: 'text-blue-900 dark:text-blue-200',
    warning: 'text-yellow-900 dark:text-yellow-200',
    error: 'text-red-900 dark:text-red-200',
    success: 'text-green-900 dark:text-green-200',
  }
  return variants[props.variant]
})

const messageClasses = computed(() => {
  const variants = {
    info: 'text-blue-800 dark:text-blue-300',
    warning: 'text-yellow-800 dark:text-yellow-300',
    error: 'text-red-800 dark:text-red-300',
    success: 'text-green-800 dark:text-green-300',
  }
  return variants[props.variant]
})

const closeButtonClasses = computed(() => {
  const variants = {
    info: 'text-blue-600 hover:text-blue-800 focus:ring-blue-500 dark:text-blue-400 dark:hover:text-blue-300',
    warning:
      'text-yellow-600 hover:text-yellow-800 focus:ring-yellow-500 dark:text-yellow-400 dark:hover:text-yellow-300',
    error: 'text-red-600 hover:text-red-800 focus:ring-red-500 dark:text-red-400 dark:hover:text-red-300',
    success:
      'text-green-600 hover:text-green-800 focus:ring-green-500 dark:text-green-400 dark:hover:text-green-300',
  }
  return variants[props.variant]
})

const dismiss = () => {
  visible.value = false
  setTimeout(() => {
    emit('close')
  }, 200) // Wait for transition to complete
}

onMounted(() => {
  if (props.autoClose && props.duration > 0) {
    autoCloseTimer = setTimeout(() => {
      dismiss()
    }, props.duration)
  }
})

onUnmounted(() => {
  if (autoCloseTimer) {
    clearTimeout(autoCloseTimer)
  }
})
</script>
