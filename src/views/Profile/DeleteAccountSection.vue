<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { authAPI } from '@/api/auth'
import { useAuthStore } from '@/stores/auth'
import { Trash2 } from 'lucide-vue-next'

const { t } = useI18n()
const router = useRouter()
const authStore = useAuthStore()

const showConfirmModal = ref(false)
const password = ref('')
const isLoading = ref(false)
const error = ref<string | null>(null)

const openDeleteModal = () => {
  showConfirmModal.value = true
  password.value = ''
  error.value = null
}

const closeDeleteModal = () => {
  showConfirmModal.value = false
  password.value = ''
  error.value = null
}

const handleDeleteAccount = async () => {
  if (!password.value) {
    error.value = t('profile.deleteAccount.errors.passwordRequired')
    return
  }

  try {
    isLoading.value = true
    error.value = null

    await authAPI.deleteAccount(password.value)

    // Clear auth state and redirect to home
    authStore.logout()
    router.push('/')
  } catch (err: any) {
    console.error('Failed to delete account:', err)
    error.value = err.response?.data?.message || t('profile.deleteAccount.errors.deleteFailed')
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <div class="delete-account-container">
    <div class="section-header">
      <div class="icon-wrapper danger">
        <Trash2 class="w-6 h-6" />
      </div>
      <div>
        <h3 class="section-title">{{ t('profile.deleteAccount.title') }}</h3>
        <p class="section-description">{{ t('profile.deleteAccount.description') }}</p>
      </div>
    </div>

    <div class="warning-box">
      <span class="warning-icon">⚠️</span>
      <div class="warning-content">
        <p class="warning-title">{{ t('profile.deleteAccount.warning') }}</p>
        <ul class="warning-list">
          <li>{{ t('profile.deleteAccount.consequences.dataLoss') }}</li>
          <li>{{ t('profile.deleteAccount.consequences.searchHistory') }}</li>
          <li>{{ t('profile.deleteAccount.consequences.irreversible') }}</li>
        </ul>
      </div>
    </div>

    <button
      @click="openDeleteModal"
      class="delete-button"
    >
      {{ t('profile.deleteAccount.deleteButton') }}
    </button>

    <!-- Confirmation Modal -->
    <Teleport to="body">
      <Transition name="modal">
        <div v-if="showConfirmModal" class="modal-overlay" @click="closeDeleteModal">
          <div class="modal-container" @click.stop>
            <div class="modal-header">
              <div class="modal-icon danger">
                <Trash2 class="w-8 h-8" />
              </div>
              <h2 class="modal-title">{{ t('profile.deleteAccount.confirmTitle') }}</h2>
              <p class="modal-description">{{ t('profile.deleteAccount.confirmDescription') }}</p>
            </div>

            <div class="modal-body">
              <!-- Error Message -->
              <div v-if="error" class="error-message">
                <span class="error-icon">⚠</span>
                {{ error }}
              </div>

              <div class="form-group">
                <label for="delete-password" class="form-label">
                  {{ t('profile.deleteAccount.passwordLabel') }}
                </label>
                <input
                  id="delete-password"
                  v-model="password"
                  type="password"
                  class="form-input"
                  :placeholder="t('profile.deleteAccount.passwordPlaceholder')"
                  :disabled="isLoading"
                  @keyup.enter="handleDeleteAccount"
                />
              </div>
            </div>

            <div class="modal-footer">
              <button
                @click="closeDeleteModal"
                class="cancel-button"
                :disabled="isLoading"
              >
                {{ t('profile.deleteAccount.cancelButton') }}
              </button>
              <button
                @click="handleDeleteAccount"
                class="confirm-delete-button"
                :disabled="isLoading || !password"
              >
                <span v-if="!isLoading">{{ t('profile.deleteAccount.confirmButton') }}</span>
                <span v-else>{{ t('profile.deleteAccount.deleting') }}...</span>
              </button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<style scoped>
.delete-account-container {
  background: white;
  border-radius: 1rem;
  padding: 2rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  border: 2px solid #fee2e2;
}

.section-header {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  margin-bottom: 1.5rem;
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

.icon-wrapper.danger {
  background: linear-gradient(135deg, rgba(239, 68, 68, 0.1) 0%, rgba(220, 38, 38, 0.1) 100%);
  color: #ef4444;
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

.warning-box {
  display: flex;
  gap: 1rem;
  padding: 1.25rem;
  background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
  border: 2px solid #f59e0b;
  border-radius: 1rem;
  margin-bottom: 1.5rem;
}

.warning-icon {
  font-size: 1.5rem;
  flex-shrink: 0;
}

.warning-content {
  flex: 1;
}

.warning-title {
  font-size: 0.875rem;
  font-weight: 700;
  color: #78350f;
  margin-bottom: 0.5rem;
}

.warning-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.warning-list li {
  font-size: 0.8125rem;
  color: #92400e;
  padding-left: 1.25rem;
  position: relative;
  margin-bottom: 0.25rem;
}

.warning-list li::before {
  content: '•';
  position: absolute;
  left: 0;
  font-weight: 700;
}

.delete-button {
  padding: 0.875rem 1.5rem;
  background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
  color: white;
  font-size: 1rem;
  font-weight: 600;
  border: none;
  border-radius: 0.75rem;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(239, 68, 68, 0.3);
  width: 100%;
}

.delete-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(239, 68, 68, 0.4);
}

/* Modal Styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
}

.modal-container {
  background: white;
  border-radius: 1.5rem;
  max-width: 500px;
  width: 100%;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  overflow: hidden;
}

.modal-header {
  padding: 2rem;
  text-align: center;
  border-bottom: 1px solid #e5e7eb;
}

.modal-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 64px;
  height: 64px;
  border-radius: 50%;
  margin-bottom: 1rem;
}

.modal-icon.danger {
  background: linear-gradient(135deg, rgba(239, 68, 68, 0.1) 0%, rgba(220, 38, 38, 0.1) 100%);
  color: #ef4444;
}

.modal-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: #111827;
  margin-bottom: 0.5rem;
}

.modal-description {
  font-size: 0.875rem;
  color: #6b7280;
  line-height: 1.5;
}

.modal-body {
  padding: 2rem;
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
  margin-bottom: 1.5rem;
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
  border-color: #ef4444;
  box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
}

.form-input:disabled {
  background: #f3f4f6;
  cursor: not-allowed;
  opacity: 0.6;
}

.modal-footer {
  padding: 1.5rem 2rem;
  background: #f9fafb;
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
}

.cancel-button {
  padding: 0.75rem 1.5rem;
  background: white;
  color: #374151;
  font-size: 0.875rem;
  font-weight: 600;
  border: 2px solid #e5e7eb;
  border-radius: 0.75rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

.cancel-button:hover:not(:disabled) {
  background: #f3f4f6;
}

.cancel-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.confirm-delete-button {
  padding: 0.75rem 1.5rem;
  background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
  color: white;
  font-size: 0.875rem;
  font-weight: 600;
  border: none;
  border-radius: 0.75rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

.confirm-delete-button:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(239, 68, 68, 0.3);
}

.confirm-delete-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none;
}

/* Modal Transitions */
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-active .modal-container,
.modal-leave-active .modal-container {
  transition: transform 0.3s ease;
}

.modal-enter-from .modal-container,
.modal-leave-to .modal-container {
  transform: scale(0.9);
}

@media (prefers-color-scheme: dark) {
  .delete-account-container {
    background: #1f2937;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
    border-color: #7f1d1d;
  }

  .section-title {
    color: #f9fafb;
  }

  .section-description {
    color: #d1d5db;
  }

  .warning-box {
    background: linear-gradient(135deg, rgba(251, 191, 36, 0.15) 0%, rgba(245, 158, 11, 0.15) 100%);
    border-color: #f59e0b;
  }

  .warning-title {
    color: #fbbf24;
  }

  .warning-list li {
    color: #fde68a;
  }

  .modal-container {
    background: #1f2937;
  }

  .modal-header {
    border-bottom-color: #374151;
  }

  .modal-title {
    color: #f9fafb;
  }

  .modal-description {
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
    border-color: #ef4444;
    box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
  }

  .form-input:disabled {
    background: #1f2937;
  }

  .modal-footer {
    background: #111827;
  }

  .cancel-button {
    background: #374151;
    color: #e5e7eb;
    border-color: #4b5563;
  }

  .cancel-button:hover:not(:disabled) {
    background: #4b5563;
  }
}
</style>
