<template>
  <div class="w-full max-w-md mx-auto">
    <div class="bg-white dark:bg-gray-800 rounded-lg p-8" style="box-shadow: 0 -2px 4px rgba(0, 0, 0, 0.06), 0 4px 6px rgba(0, 0, 0, 0.1);">
      <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">
        {{ t('auth.createAccount') }}
      </h2>

      <form @submit.prevent="handleSubmit" class="space-y-4">
        <!-- Nickname Field with Availability Check -->
        <div>
          <label for="nickname" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            {{ t('auth.nickname') }}
          </label>
          <div class="relative">
            <input
              id="nickname"
              v-model="formData.nickname"
              type="text"
              :placeholder="t('auth.enterNickname')"
              autocomplete="username"
              :class="[
                'w-full px-4 py-2 pr-10 border rounded-lg',
                'bg-white dark:bg-gray-700',
                'text-gray-900 dark:text-white',
                'placeholder-gray-400 dark:placeholder-gray-500',
                'focus:outline-none focus:ring-2',
                nicknameInputClasses
              ]"
              @input="handleNicknameInput"
            />

            <!-- Loading spinner -->
            <div v-if="isCheckingNickname" class="absolute right-3 top-1/2 -translate-y-1/2">
              <svg class="animate-spin h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </div>

            <!-- Success icon -->
            <div v-else-if="nicknameAvailable && formData.nickname.length >= 3" class="absolute right-3 top-1/2 -translate-y-1/2">
              <svg class="h-5 w-5 text-green-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clip-rule="evenodd" />
              </svg>
            </div>

            <!-- Error icon -->
            <div v-else-if="nicknameAvailable === false && formData.nickname.length >= 3" class="absolute right-3 top-1/2 -translate-y-1/2">
              <svg class="h-5 w-5 text-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z" clip-rule="evenodd" />
              </svg>
            </div>
          </div>

          <!-- Success message -->
          <p v-if="nicknameAvailable && formData.nickname.length >= 3" class="mt-1 text-xs text-green-600 dark:text-green-400">
            {{ t('auth.nicknameAvailable') }}
          </p>

          <!-- Error message -->
          <p v-else-if="nicknameAvailable === false && formData.nickname.length >= 3" class="mt-1 text-xs text-red-600 dark:text-red-400">
            {{ t('auth.nicknameTaken') }}
          </p>

          <!-- Validation error -->
          <p v-else-if="errors.nickname" class="mt-1 text-xs text-red-600 dark:text-red-400">
            {{ errors.nickname }}
          </p>

          <!-- Hint -->
          <p v-else class="mt-1 text-xs text-gray-500 dark:text-gray-400">
            {{ t('auth.nicknameHint') }}
          </p>
        </div>

        <BaseInput
          id="password"
          v-model="formData.password"
          type="password"
          :label="t('auth.password')"
          :placeholder="t('auth.enterPassword')"
          :error="errors.password"
          :hint="t('auth.passwordHint')"
          autocomplete="new-password"
          @input="errors.password = undefined"
        />

        <BaseInput
          id="confirmPassword"
          v-model="formData.confirmPassword"
          type="password"
          :label="t('auth.confirmPassword')"
          :placeholder="t('auth.confirmPasswordPlaceholder')"
          :error="errors.confirmPassword"
          autocomplete="new-password"
          @input="errors.confirmPassword = undefined"
        />

        <BaseButton type="submit" variant="primary" class="w-full" :disabled="isSubmitting || !canSubmit">
          {{ isSubmitting ? t('auth.creatingAccount') : t('common.signUp') }}
        </BaseButton>
      </form>

      <p class="text-center text-sm text-gray-600 dark:text-gray-400 mt-4">
        {{ t('auth.alreadyHaveAccount') }}
        <router-link to="/login" class="text-blue-600 dark:text-blue-400 hover:underline">
          {{ t('common.signIn') }}
        </router-link>
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import { z } from 'zod'
import { useI18n } from 'vue-i18n'
import { authAPI } from '@/api/auth'
import BaseButton from '@/components/ui/BaseButton.vue'
import BaseInput from '@/components/ui/BaseInput.vue'

const { t } = useI18n()

const registerSchema = z
  .object({
    nickname: z.string().min(3, t('validation.nicknameMinLength')),
    password: z
      .string()
      .min(8, t('validation.passwordMinLength8'))
      .regex(/[A-Z]/, t('validation.passwordCapital'))
      .regex(/[0-9]/, t('validation.passwordNumber'))
      .regex(/[^A-Za-z0-9]/, t('validation.passwordSpecial')),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: t('validation.passwordsMismatch'),
    path: ['confirmPassword'],
  })

type RegisterFormData = z.infer<typeof registerSchema>

const formData = reactive<RegisterFormData>({
  nickname: '',
  password: '',
  confirmPassword: '',
})

const errors = reactive<Partial<Record<keyof RegisterFormData, string>>>({})
const isSubmitting = ref(false)
const isCheckingNickname = ref(false)
const nicknameAvailable = ref<boolean | null>(null)
let debounceTimeout: ReturnType<typeof setTimeout> | null = null

const emit = defineEmits<{
  submit: [data: Omit<RegisterFormData, 'confirmPassword'>]
  socialLogin: [provider: 'google' | 'apple']
}>()

// Computed class for nickname input border
const nicknameInputClasses = computed(() => {
  if (nicknameAvailable.value && formData.nickname.length >= 3) {
    return 'border-green-500 dark:border-green-500 focus:ring-green-500 focus:border-green-500'
  } else if (nicknameAvailable.value === false && formData.nickname.length >= 3) {
    return 'border-red-500 dark:border-red-500 focus:ring-red-500 focus:border-red-500'
  } else if (errors.nickname) {
    return 'border-red-500 dark:border-red-500 focus:ring-red-500 focus:border-red-500'
  }
  return 'border-gray-300 dark:border-gray-600 focus:ring-blue-500 focus:border-blue-500'
})

// Check if form can be submitted
const canSubmit = computed(() => {
  return (
    formData.nickname.length >= 3 &&
    nicknameAvailable.value === true &&
    formData.password.length >= 8 &&
    formData.confirmPassword.length >= 8 &&
    !isCheckingNickname.value
  )
})

// Debounced nickname availability check
const checkNicknameAvailability = async (nickname: string) => {
  if (nickname.length < 3) {
    nicknameAvailable.value = null
    return
  }

  isCheckingNickname.value = true
  try {
    const available = await authAPI.checkNickname(nickname)
    nicknameAvailable.value = available
  } catch (error) {
    console.error('Error checking nickname:', error)
    nicknameAvailable.value = null
  } finally {
    isCheckingNickname.value = false
  }
}

// Handle nickname input with debouncing
const handleNicknameInput = () => {
  errors.nickname = undefined
  nicknameAvailable.value = null

  // Clear previous timeout
  if (debounceTimeout) {
    clearTimeout(debounceTimeout)
  }

  // Set new timeout for debounced check
  debounceTimeout = setTimeout(() => {
    checkNicknameAvailability(formData.nickname)
  }, 500) // 500ms debounce
}

const handleSubmit = async () => {
  // Clear previous errors
  errors.nickname = undefined
  errors.password = undefined
  errors.confirmPassword = undefined

  // Check nickname availability one last time
  if (nicknameAvailable.value !== true) {
    errors.nickname = t('auth.nicknameTaken')
    return
  }

  // Validate form
  const result = registerSchema.safeParse(formData)

  if (!result.success) {
    // Map validation errors to form fields
    const zodErrors = result.error.flatten().fieldErrors
    if (zodErrors.nickname?.[0]) {
      errors.nickname = zodErrors.nickname[0]
    }
    if (zodErrors.password?.[0]) {
      errors.password = zodErrors.password[0]
    }
    if (zodErrors.confirmPassword?.[0]) {
      errors.confirmPassword = zodErrors.confirmPassword[0]
    }
    return
  }

  isSubmitting.value = true
  try {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { confirmPassword, ...dataToSubmit } = result.data
    emit('submit', dataToSubmit)
  } finally {
    isSubmitting.value = false
  }
}
</script>
