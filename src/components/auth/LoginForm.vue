<template>
  <div class="w-full max-w-md mx-auto">
    <div class="bg-white dark:bg-gray-800 rounded-lg p-8" style="box-shadow: 0 -2px 4px rgba(0, 0, 0, 0.06), 0 4px 6px rgba(0, 0, 0, 0.1);">
      <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">
        {{ t('common.signIn') }}
      </h2>

      <form @submit.prevent="handleSubmit" class="space-y-4">
        <BaseInput
          id="nickname"
          v-model="formData.nickname"
          type="text"
          :label="t('auth.nickname')"
          :placeholder="t('auth.enterNickname')"
          :error="errors.nickname"
          autocomplete="username"
          @input="errors.nickname = undefined"
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

        <div class="flex items-center">
          <input
            id="remember_me"
            v-model="formData.remember_me"
            type="checkbox"
            class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label for="remember_me" class="ml-2 block text-sm text-gray-900 dark:text-gray-300">
            {{ t('auth.rememberMe') }}
          </label>
        </div>

        <BaseButton type="submit" variant="primary" class="w-full" :disabled="isSubmitting">
          {{ isSubmitting ? t('auth.signingIn') : t('common.signIn') }}
        </BaseButton>
      </form>

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
  nickname: z.string().min(3, t('validation.nicknameMinLength')),
  password: z.string().min(6, t('validation.passwordMinLength')),
  remember_me: z.boolean().optional(),
})

type LoginFormData = z.infer<typeof loginSchema>

const formData = reactive<LoginFormData>({
  nickname: '',
  password: '',
  remember_me: false,
})

const errors = reactive<Partial<Record<keyof LoginFormData, string>>>({})
const isSubmitting = ref(false)

const emit = defineEmits<{
  submit: [data: LoginFormData]
  socialLogin: [provider: 'google' | 'apple']
}>()

const handleSubmit = async () => {
  // Clear previous errors
  errors.nickname = undefined
  errors.password = undefined

  // Validate form
  const result = loginSchema.safeParse(formData)

  if (!result.success) {
    // Map validation errors to form fields
    for (const issue of result.error.issues) {
      const field = issue.path[0] as keyof typeof errors
      if (field && issue.message) {
        errors[field] = issue.message
      }
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
