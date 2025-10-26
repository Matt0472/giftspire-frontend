<template>
  <div class="min-h-[calc(100vh-200px)] flex items-center justify-center bg-gradient-to-b from-gray-50 to-white dark:from-gray-800 dark:to-gray-900 px-4 py-12">
    <div class="max-w-md w-full">
      <div
        class="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 text-center border border-gray-200 dark:border-gray-700"
      >
        <!-- Email Icon -->
        <div class="mx-auto w-16 h-16 mb-6 flex items-center justify-center">
          <svg
            class="w-16 h-16 text-blue-600 dark:text-blue-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
            />
          </svg>
        </div>

        <!-- Title -->
        <h1
          class="text-2xl font-bold text-gray-900 dark:text-white mb-3"
        >
          {{ t('verifyEmail.title') }}
        </h1>

        <!-- Description -->
        <p class="text-gray-600 dark:text-gray-300 mb-6">
          {{ t('verifyEmail.description') }}
        </p>

        <!-- Info Box -->
        <div
          class="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-6 text-left"
        >
          <p class="text-sm text-blue-800 dark:text-blue-200">
            <strong>{{ t('verifyEmail.didntReceive') }}</strong>
          </p>
          <ul class="text-sm text-blue-700 dark:text-blue-300 mt-2 list-disc list-inside space-y-1">
            <li>{{ t('verifyEmail.checkSpam') }}</li>
            <li>{{ t('verifyEmail.checkCorrectEmail') }}</li>
            <li>{{ t('verifyEmail.waitFewMinutes') }}</li>
          </ul>
        </div>

        <!-- Resend Button -->
        <div class="space-y-3">
          <!-- Email Input for Unauthenticated Users -->
          <div v-if="!isAuthenticated" class="mb-4">
            <BaseInput
              v-model="email"
              type="email"
              :placeholder="t('verifyEmail.enterEmailAddress')"
              :label="t('verifyEmail.emailAddressLabel')"
              :disabled="isResending || countdown > 0"
            />
          </div>

          <BaseButton
            variant="primary"
            size="lg"
            class="w-full"
            :disabled="isResending || countdown > 0"
            @click="handleResendEmail"
          >
            <span v-if="countdown > 0">{{ t('verifyEmail.resendIn', [countdown]) }}</span>
            <span v-else-if="isResending">{{ t('auth.sending') }}</span>
            <span v-else>{{ t('verifyEmail.resendButton') }}</span>
          </BaseButton>

          <!-- Success Message -->
          <div
            v-if="successMessage"
            class="text-green-600 dark:text-green-400 text-sm"
          >
            {{ successMessage }}
          </div>

          <!-- Error Message -->
          <div v-if="errorMessage" class="text-red-600 dark:text-red-400 text-sm">
            {{ errorMessage }}
          </div>

          <!-- Back to Login -->
          <div class="pt-4">
            <router-link
              to="/login"
              class="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
            >
              ← {{ t('common.backToLogin') }}
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { authAPI } from '@/api/auth'
import { useAuthStore } from '@/stores/auth'
import BaseButton from '@/components/ui/BaseButton.vue'
import BaseInput from '@/components/ui/BaseInput.vue'

const { t } = useI18n()
const authStore = useAuthStore()
const isAuthenticated = computed(() => authStore.isAuthenticated)

const isResending = ref(false)
const countdown = ref(0)
const successMessage = ref('')
const errorMessage = ref('')
const email = ref('')

let countdownInterval: NodeJS.Timeout | null = null

const startCountdown = () => {
  countdown.value = 60 // 60 seconds cooldown
  countdownInterval = setInterval(() => {
    countdown.value--
    if (countdown.value <= 0 && countdownInterval) {
      clearInterval(countdownInterval)
      countdownInterval = null
    }
  }, 1000)
}

const handleResendEmail = async () => {
  if (isResending.value || countdown.value > 0) return

  isResending.value = true
  successMessage.value = ''
  errorMessage.value = ''

  try {
    if (isAuthenticated.value) {
      // Authenticated user - use token-based endpoint
      await authAPI.resendVerificationEmail()
      successMessage.value = t('verifyEmail.emailSent')
      startCountdown()
    } else {
      // Unauthenticated user - need email address
      if (!email.value) {
        errorMessage.value = t('verifyEmail.pleaseEnterEmail')
        return
      }

      await authAPI.resendVerificationEmailByEmail(email.value)
      successMessage.value = t('verifyEmail.emailSentGeneric')
      startCountdown()
    }
  } catch (error: any) {
    if (error.response?.status === 401) {
      errorMessage.value = t('verifyEmail.pleaseLogin')
    } else if (error.response?.status === 422) {
      errorMessage.value = t('verifyEmail.invalidEmail')
    } else {
      errorMessage.value =
        error.response?.data?.message || t('verifyEmail.resendFailed')
    }
  } finally {
    isResending.value = false
  }
}

// Cleanup on component unmount
import { onUnmounted } from 'vue'
onUnmounted(() => {
  if (countdownInterval) {
    clearInterval(countdownInterval)
  }
})
</script>
