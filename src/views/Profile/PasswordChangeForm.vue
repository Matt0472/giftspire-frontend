<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { authAPI } from '@/api/auth'
import { Lock } from 'lucide-vue-next'

const { t } = useI18n()

const oldPassword = ref('')
const newPassword = ref('')
const confirmPassword = ref('')
const isLoading = ref(false)
const error = ref<string | null>(null)
const success = ref(false)

const emit = defineEmits<{
  success: []
}>()

const validateForm = (): boolean => {
  error.value = null

  if (!oldPassword.value || !newPassword.value || !confirmPassword.value) {
    error.value = t('profile.password.errors.allFieldsRequired')
    return false
  }

  if (newPassword.value.length < 8) {
    error.value = t('profile.password.errors.passwordTooShort')
    return false
  }

  if (newPassword.value !== confirmPassword.value) {
    error.value = t('profile.password.errors.passwordsMismatch')
    return false
  }

  if (oldPassword.value === newPassword.value) {
    error.value = t('profile.password.errors.samePassword')
    return false
  }

  return true
}

const handleSubmit = async () => {
  if (!validateForm()) return

  try {
    isLoading.value = true
    error.value = null
    success.value = false

    await authAPI.updatePassword(oldPassword.value, newPassword.value)

    success.value = true
    oldPassword.value = ''
    newPassword.value = ''
    confirmPassword.value = ''

    emit('success')

    // Clear success message after 3 seconds
    setTimeout(() => {
      success.value = false
    }, 3000)
  } catch (err: any) {
    console.error('Failed to update password:', err)
    error.value = err.response?.data?.message || t('profile.password.errors.updateFailed')
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <div class="password-form-container">
    <div class="section-header">
      <div class="icon-wrapper">
        <Lock class="w-6 h-6" />
      </div>
      <div>
        <h3 class="section-title">{{ t('profile.password.title') }}</h3>
        <p class="section-description">{{ t('profile.password.description') }}</p>
      </div>
    </div>

    <form @submit.prevent="handleSubmit" class="password-form">
      <!-- Success Message -->
      <div v-if="success" class="success-message">
        <span class="success-icon">✓</span>
        {{ t('profile.password.success') }}
      </div>

      <!-- Error Message -->
      <div v-if="error" class="error-message">
        <span class="error-icon">⚠</span>
        {{ error }}
      </div>

      <!-- Current Password -->
      <div class="form-group">
        <label for="old-password" class="form-label">
          {{ t('profile.password.currentPassword') }}
        </label>
        <input
          id="old-password"
          v-model="oldPassword"
          type="password"
          class="form-input"
          :placeholder="t('profile.password.currentPasswordPlaceholder')"
          :disabled="isLoading"
        />
      </div>

      <!-- New Password -->
      <div class="form-group">
        <label for="new-password" class="form-label">
          {{ t('profile.password.newPassword') }}
        </label>
        <input
          id="new-password"
          v-model="newPassword"
          type="password"
          class="form-input"
          :placeholder="t('profile.password.newPasswordPlaceholder')"
          :disabled="isLoading"
        />
      </div>

      <!-- Confirm Password -->
      <div class="form-group">
        <label for="confirm-password" class="form-label">
          {{ t('profile.password.confirmPassword') }}
        </label>
        <input
          id="confirm-password"
          v-model="confirmPassword"
          type="password"
          class="form-input"
          :placeholder="t('profile.password.confirmPasswordPlaceholder')"
          :disabled="isLoading"
        />
      </div>

      <!-- Submit Button -->
      <button
        type="submit"
        class="submit-button"
        :disabled="isLoading"
      >
        <span v-if="!isLoading">{{ t('profile.password.updateButton') }}</span>
        <span v-else>{{ t('profile.password.updating') }}...</span>
      </button>
    </form>
  </div>
</template>

<style scoped>
.password-form-container {
  background: white;
  border-radius: 1rem;
  padding: 2rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.section-header {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  margin-bottom: 2rem;
}

.icon-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  background: linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(168, 85, 247, 0.1) 100%);
  border-radius: 12px;
  color: #6366f1;
  flex-shrink: 0;
}

.section-title {
  font-size: 1.25rem;
  font-weight: 700;
  color: #111827;
  margin-bottom: 0.25rem;
}

.section-description {
  font-size: 0.875rem;
  color: #6b7280;
}

.password-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.success-message {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem;
  background: linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%);
  border: 1px solid #10b981;
  border-radius: 0.75rem;
  color: #065f46;
  font-size: 0.875rem;
  font-weight: 600;
  animation: slideIn 0.3s ease-out;
}

.success-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  background: #10b981;
  color: white;
  border-radius: 50%;
  font-weight: 700;
  font-size: 0.875rem;
}

.error-message {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem;
  background: linear-gradient(135deg, #fee2e2 0%, #fecaca 100%);
  border: 1px solid #ef4444;
  border-radius: 0.75rem;
  color: #991b1b;
  font-size: 0.875rem;
  font-weight: 600;
  animation: slideIn 0.3s ease-out;
}

.error-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  background: #ef4444;
  color: white;
  border-radius: 50%;
  font-weight: 700;
  font-size: 0.875rem;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-label {
  font-size: 0.875rem;
  font-weight: 600;
  color: #374151;
}

.form-input {
  padding: 0.75rem 1rem;
  border: 2px solid #e5e7eb;
  border-radius: 0.75rem;
  font-size: 1rem;
  color: #111827;
  background: white;
  transition: all 0.2s ease;
}

.form-input:focus {
  outline: none;
  border-color: #6366f1;
  box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
}

.form-input:disabled {
  background: #f3f4f6;
  cursor: not-allowed;
  opacity: 0.6;
}

.submit-button {
  padding: 0.875rem 1.5rem;
  background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
  color: white;
  font-size: 1rem;
  font-weight: 600;
  border: none;
  border-radius: 0.75rem;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(99, 102, 241, 0.3);
}

.submit-button:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(99, 102, 241, 0.4);
}

.submit-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

@media (prefers-color-scheme: dark) {
  .password-form-container {
    background: #1f2937;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
  }

  .section-title {
    color: #f9fafb;
  }

  .section-description {
    color: #d1d5db;
  }

  .form-label {
    color: #e5e7eb;
  }

  .form-input {
    background: #374151;
    border-color: #4b5563;
    color: #f9fafb;
  }

  .form-input:focus {
    border-color: #818cf8;
    box-shadow: 0 0 0 3px rgba(129, 140, 248, 0.1);
  }

  .form-input:disabled {
    background: #1f2937;
  }
}
</style>
