<template>
  <div class="min-h-[calc(100vh-200px)] flex items-center justify-center bg-gradient-to-b from-gray-50 to-white dark:from-gray-800 dark:to-gray-900 px-4 py-12">
    <div class="max-w-md w-full">
      <div
        class="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 text-center border border-gray-200 dark:border-gray-700"
      >
        <!-- Success State -->
        <div v-if="isSuccess">
          <!-- Success Icon -->
          <div class="mx-auto w-16 h-16 mb-6 flex items-center justify-center">
            <svg
              class="w-16 h-16 text-green-600 dark:text-green-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>

          <!-- Title -->
          <h1 class="text-2xl font-bold text-gray-900 dark:text-white mb-3">
            {{ t('emailVerified.successTitle') }}
          </h1>

          <!-- Description -->
          <p class="text-gray-600 dark:text-gray-300 mb-6">
            {{ t('emailVerified.successDescription') }}
          </p>

          <!-- Auto redirect message -->
          <div
            class="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4 mb-6"
          >
            <p class="text-sm text-green-800 dark:text-green-200">
              {{ t('emailVerified.redirecting', [countdown]) }}
            </p>
          </div>

          <!-- Login Button -->
          <BaseButton variant="primary" size="lg" class="w-full" @click="goToLogin">
            {{ t('emailVerified.goToLogin') }}
          </BaseButton>
        </div>

        <!-- Error State -->
        <div v-else>
          <!-- Error Icon -->
          <div class="mx-auto w-16 h-16 mb-6 flex items-center justify-center">
            <svg
              class="w-16 h-16 text-red-600 dark:text-red-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>

          <!-- Title -->
          <h1 class="text-2xl font-bold text-gray-900 dark:text-white mb-3">
            {{ t('emailVerified.failedTitle') }}
          </h1>

          <!-- Description -->
          <p class="text-gray-600 dark:text-gray-300 mb-6">
            {{ errorMessage }}
          </p>

          <!-- Error Info Box -->
          <div
            class="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-6 text-left"
          >
            <p class="text-sm text-red-800 dark:text-red-200">
              <strong>{{ t('emailVerified.whatCanYouDo') }}</strong>
            </p>
            <ul class="text-sm text-red-700 dark:text-red-300 mt-2 list-disc list-inside space-y-1">
              <li>{{ t('emailVerified.requestNewEmail') }}</li>
              <li>{{ t('emailVerified.contactSupport') }}</li>
              <li>{{ t('emailVerified.tryDifferentEmail') }}</li>
            </ul>
          </div>

          <!-- Action Buttons -->
          <div class="space-y-3">
            <BaseButton variant="primary" size="lg" class="w-full" @click="goToResendPage">
              {{ t('emailVerified.requestNewButton') }}
            </BaseButton>

            <BaseButton variant="outline" size="lg" class="w-full" @click="goToLogin">
              {{ t('emailVerified.backToLogin') }}
            </BaseButton>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import BaseButton from '@/components/ui/BaseButton.vue'

const { t } = useI18n()
const route = useRoute()
const router = useRouter()

const isSuccess = ref(false)
const errorMessage = ref('')
const countdown = ref(5)

let countdownInterval: NodeJS.Timeout | null = null

onMounted(() => {
  // Check query parameters
  if (route.query.success === 'true') {
    isSuccess.value = true
    startCountdown()
  } else if (route.query.error) {
    isSuccess.value = false
    setErrorMessage(route.query.error as string)
  } else {
    // No valid query params, redirect to home
    router.push('/')
  }
})

const setErrorMessage = (error: string) => {
  switch (error) {
    case 'user_not_found':
      errorMessage.value = t('emailVerified.errors.userNotFound')
      break
    case 'invalid_link':
      errorMessage.value = t('emailVerified.errors.invalidLink')
      break
    case 'already_verified':
      errorMessage.value = t('emailVerified.errors.alreadyVerified')
      break
    default:
      errorMessage.value = t('emailVerified.errors.default')
  }
}

const startCountdown = () => {
  countdownInterval = setInterval(() => {
    countdown.value--
    if (countdown.value <= 0) {
      if (countdownInterval) {
        clearInterval(countdownInterval)
      }
      goToLogin()
    }
  }, 1000)
}

const goToLogin = () => {
  if (countdownInterval) {
    clearInterval(countdownInterval)
  }
  router.push('/login')
}

const goToResendPage = () => {
  router.push('/verify-email-pending')
}

onUnmounted(() => {
  if (countdownInterval) {
    clearInterval(countdownInterval)
  }
})
</script>
