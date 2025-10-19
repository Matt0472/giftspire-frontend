<template>
  <div class="w-full max-w-md mx-auto">
    <div class="bg-white dark:bg-gray-800 rounded-lg p-8" style="box-shadow: 0 -2px 4px rgba(0, 0, 0, 0.06), 0 4px 6px rgba(0, 0, 0, 0.1);">
      <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">
        Create Account
      </h2>

      <form @submit.prevent="handleSubmit" class="space-y-4">
        <BaseInput
          id="name"
          v-model="formData.name"
          type="text"
          label="Full Name"
          placeholder="Enter your full name"
          :error="errors.name"
          autocomplete="name"
          @input="errors.name = undefined"
        />

        <BaseInput
          id="email"
          v-model="formData.email"
          type="email"
          label="Email"
          placeholder="Enter your email"
          :error="errors.email"
          autocomplete="email"
          @input="errors.email = undefined"
        />

        <BaseInput
          id="password"
          v-model="formData.password"
          type="password"
          label="Password"
          placeholder="Enter your password"
          :error="errors.password"
          hint="Must contain: 8+ characters, one capital letter, one number, one special character"
          autocomplete="new-password"
          @input="errors.password = undefined"
        />

        <BaseInput
          id="confirmPassword"
          v-model="formData.confirmPassword"
          type="password"
          label="Confirm Password"
          placeholder="Confirm your password"
          :error="errors.confirmPassword"
          autocomplete="new-password"
          @input="errors.confirmPassword = undefined"
        />

        <BaseButton type="submit" variant="primary" class="w-full" :disabled="isSubmitting">
          {{ isSubmitting ? 'Creating account...' : 'Sign Up' }}
        </BaseButton>
      </form>

      <div class="relative my-6">
        <div class="absolute inset-0 flex items-center">
          <div class="w-full border-t border-gray-300 dark:border-gray-600"></div>
        </div>
        <div class="relative flex justify-center text-sm">
          <span class="px-2 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400">OR</span>
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
          <span class="text-gray-700 dark:text-gray-200 font-medium">Continue with Google</span>
        </button>

        <button
          type="button"
          @click="emit('socialLogin', 'apple')"
          class="w-full flex items-center justify-center gap-3 px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
        >
          <svg class="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
            <path
              class="text-gray-900 dark:text-white"
              d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"
            />
          </svg>
          <span class="text-gray-700 dark:text-gray-200 font-medium">Continue with Apple</span>
        </button>
      </div>

      <p class="text-center text-sm text-gray-600 dark:text-gray-400 mt-4">
        Already have an account?
        <router-link to="/login" class="text-blue-600 dark:text-blue-400 hover:underline">
          Sign in
        </router-link>
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { z } from 'zod'
import BaseButton from '@/components/ui/BaseButton.vue'
import BaseInput from '@/components/ui/BaseInput.vue'

const registerSchema = z
  .object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().email('Please enter a valid email address'),
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .regex(/[A-Z]/, 'Password must contain at least one capital letter')
      .regex(/[0-9]/, 'Password must contain at least one number')
      .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  })

type RegisterFormData = z.infer<typeof registerSchema>

const formData = reactive<RegisterFormData>({
  name: '',
  email: '',
  password: '',
  confirmPassword: '',
})

const errors = reactive<Partial<Record<keyof RegisterFormData, string>>>({})
const isSubmitting = ref(false)

const emit = defineEmits<{
  submit: [data: Omit<RegisterFormData, 'confirmPassword'>]
  socialLogin: [provider: 'google' | 'apple']
}>()

const handleSubmit = async () => {
  // Clear previous errors
  errors.name = undefined
  errors.email = undefined
  errors.password = undefined
  errors.confirmPassword = undefined

  // Validate form
  const result = registerSchema.safeParse(formData)

  if (!result.success) {
    // Map validation errors to form fields
    const zodErrors = result.error.flatten().fieldErrors
    if (zodErrors.name?.[0]) {
      errors.name = zodErrors.name[0]
    }
    if (zodErrors.email?.[0]) {
      errors.email = zodErrors.email[0]
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
    const { confirmPassword, ...dataToSubmit } = result.data
    emit('submit', dataToSubmit)
  } finally {
    isSubmitting.value = false
  }
}
</script>
