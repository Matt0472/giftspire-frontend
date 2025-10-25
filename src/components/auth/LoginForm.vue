<template>
  <div class="w-full max-w-md mx-auto">
    <div class="bg-white dark:bg-gray-800 rounded-lg p-8" style="box-shadow: 0 -2px 4px rgba(0, 0, 0, 0.06), 0 4px 6px rgba(0, 0, 0, 0.1);">
      <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">
        {{ t('common.signIn') }}
      </h2>

      <form @submit.prevent="handleSubmit" class="space-y-4">
        <BaseInput
          id="email"
          v-model="formData.email"
          type="email"
          :label="t('auth.email')"
          :placeholder="t('auth.enterEmail')"
          :error="errors.email"
          autocomplete="email"
          @input="errors.email = undefined"
        />

        <BaseInput
          id="password"
          v-model="formData.password"
          type="password"
          :label="t('auth.password')"
          :placeholder="t('auth.enterPassword')"
          :error="errors.password"
          autocomplete="current-password"
          @input="errors.password = undefined"
        />

        <BaseButton type="submit" variant="primary" class="w-full" :disabled="isSubmitting">
          {{ isSubmitting ? t('auth.signingIn') : t('common.signIn') }}
        </BaseButton>
      </form>

      <div class="relative my-6">
        <div class="absolute inset-0 flex items-center">
          <div class="w-full border-t border-gray-300 dark:border-gray-600"></div>
        </div>
        <div class="relative flex justify-center text-sm">
          <span class="px-2 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400">{{ t('common.or') }}</span>
        </div>
      </div>

      <!-- Social Login Buttons -->
      <div class="space-y-3 mb-4">
        <button
          type="button"
          @click="emit('socialLogin', 'google')"
          class="w-full flex items-center justify-center gap-3 px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
        >
          <svg class="w-5 h-5" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
          </svg>
          <span class="text-gray-700 dark:text-gray-200 font-medium">{{ t('auth.continueWithGoogle') }}</span>
        </button>
      </div>

      <p class="text-center text-sm text-gray-600 dark:text-gray-400 mt-4">
        {{ t('auth.dontHaveAccount') }}
        <router-link to="/register" class="text-blue-600 dark:text-blue-400 hover:underline">
          {{ t('common.signUp') }}
        </router-link>
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { z } from 'zod'
import { useI18n } from 'vue-i18n'
import BaseButton from '@/components/ui/BaseButton.vue'
import BaseInput from '@/components/ui/BaseInput.vue'

const { t } = useI18n()

const loginSchema = z.object({
  email: z.string().email(t('validation.emailRequired')),
  password: z.string().min(6, t('validation.passwordMinLength')),
})

type LoginFormData = z.infer<typeof loginSchema>

const formData = reactive<LoginFormData>({
  email: '',
  password: '',
})

const errors = reactive<Partial<Record<keyof LoginFormData, string>>>({})
const isSubmitting = ref(false)

const emit = defineEmits<{
  submit: [data: LoginFormData]
  socialLogin: [provider: 'google' | 'apple']
}>()

const handleSubmit = async () => {
  // Clear previous errors
  errors.email = undefined
  errors.password = undefined

  // Validate form
  const result = loginSchema.safeParse(formData)

  if (!result.success) {
    // Map validation errors to form fields
    const zodErrors = result.error.flatten().fieldErrors
    if (zodErrors.email?.[0]) {
      errors.email = zodErrors.email[0]
    }
    if (zodErrors.password?.[0]) {
      errors.password = zodErrors.password[0]
    }
    return
  }

  isSubmitting.value = true
  try {
    emit('submit', result.data)
  } finally {
    isSubmitting.value = false
  }
}
</script>
