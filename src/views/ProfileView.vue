<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useAuthStore } from '@/stores/auth'
import { User, Globe, Palette } from 'lucide-vue-next'
import AppBreadcrumbs from '@/components/ui/AppBreadcrumbs.vue'
import LanguageSwitcher from '@/components/ui/LanguageSwitcher.vue'
import ThemeToggle from '@/components/ui/ThemeToggle.vue'
import PasswordChangeForm from './Profile/PasswordChangeForm.vue'
import DeleteAccountSection from './Profile/DeleteAccountSection.vue'

const { t } = useI18n()
const authStore = useAuthStore()

const breadcrumbItems = computed(() => [
  { label: t('common.dashboard'), to: { name: 'dashboard' } },
  { label: t('profile.title'), to: undefined },
])
</script>

<template>
  <div class="profile-container">
    <!-- Breadcrumbs -->
    <AppBreadcrumbs :items="breadcrumbItems" />

    <!-- Page Header -->
    <div class="page-header">
      <div class="header-icon">
        <User class="w-10 h-10" />
      </div>
      <div>
        <h1 class="page-title">{{ t('profile.title') }}</h1>
        <p class="page-subtitle">{{ t('profile.subtitle') }}</p>
      </div>
    </div>

    <!-- Profile Content -->
    <div class="profile-content">
      <!-- User Info Section -->
      <div class="profile-section">
        <div class="section-header">
          <div class="icon-wrapper">
            <User class="w-6 h-6" />
          </div>
          <div>
            <h3 class="section-title">{{ t('profile.userInfo.title') }}</h3>
            <p class="section-description">{{ t('profile.userInfo.description') }}</p>
          </div>
        </div>

        <div class="form-group">
          <label for="nickname" class="form-label">
            {{ t('profile.userInfo.nickname') }}
          </label>
          <input
            id="nickname"
            :value="authStore.user?.display_name"
            type="text"
            class="form-input"
            disabled
          />
          <p class="form-hint">{{ t('profile.userInfo.nicknameHint') }}</p>
        </div>
      </div>

      <!-- Preferences Section (Language & Theme) -->
      <div class="preferences-grid">
        <!-- Language Section -->
        <div class="profile-section">
          <div class="section-header">
            <div class="icon-wrapper">
              <Globe class="w-6 h-6" />
            </div>
            <div>
              <h3 class="section-title">{{ t('profile.language.title') }}</h3>
              <p class="section-description">{{ t('profile.language.description') }}</p>
            </div>
          </div>

          <div class="preference-row">
            <LanguageSwitcher />
          </div>
        </div>

        <!-- Theme Section -->
        <div class="profile-section">
          <div class="section-header">
            <div class="icon-wrapper">
              <Palette class="w-6 h-6" />
            </div>
            <div>
              <h3 class="section-title">{{ t('profile.theme.title') }}</h3>
              <p class="section-description">{{ t('profile.theme.description') }}</p>
            </div>
          </div>

          <div class="preference-row">
            <ThemeToggle />
          </div>
        </div>
      </div>

      <!-- Password Change Section -->
      <PasswordChangeForm />

      <!-- Delete Account Section -->
      <DeleteAccountSection />
    </div>
  </div>
</template>

<style scoped>
.profile-container {
  max-width: 1000px;
  margin: 0 auto;
  padding: 2rem 1rem;
}

/* Page Header */
.page-header {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  margin-bottom: 3rem;
  animation: fadeInDown 0.6s ease-out;
}

@keyframes fadeInDown {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.header-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 72px;
  height: 72px;
  background: linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(168, 85, 247, 0.1) 100%);
  border-radius: 1rem;
  color: #6366f1;
}

.page-title {
  font-size: 2.5rem;
  font-weight: 800;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  margin-bottom: 0.5rem;
  letter-spacing: -0.02em;
}

.page-subtitle {
  font-size: 1.125rem;
  color: #6b7280;
}

/* Profile Content */
.profile-content {
  display: flex;
  flex-direction: column;
  gap: 2rem;
  animation: fadeInUp 0.6s ease-out 0.2s both;
}

/* Preferences Grid - Language & Theme side by side */
.preferences-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.profile-section {
  background: white;
  border-radius: 1rem;
  padding: 2rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
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

.form-input:disabled {
  background: #f3f4f6;
  cursor: not-allowed;
  opacity: 0.8;
}

.form-hint {
  font-size: 0.8125rem;
  color: #6b7280;
  font-style: italic;
}

.preference-row {
  display: flex;
  align-items: center;
  gap: 1rem;
}

@media (prefers-color-scheme: dark) {
  .page-subtitle {
    color: #d1d5db;
  }

  .profile-section {
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

  .form-input:disabled {
    background: #1f2937;
  }

  .form-hint {
    color: #9ca3af;
  }
}

@media (max-width: 768px) {
  .page-header {
    flex-direction: column;
    align-items: flex-start;
    text-align: left;
  }

  .page-title {
    font-size: 2rem;
  }

  .page-subtitle {
    font-size: 1rem;
  }

  .preferences-grid {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }

  .profile-section {
    padding: 1.5rem;
  }
}
</style>
