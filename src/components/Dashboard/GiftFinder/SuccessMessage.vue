<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'

const { t } = useI18n()
const router = useRouter()

const emit = defineEmits<{
  newSearch: []
}>()

const goToPendingOrders = () => {
  router.push({ name: 'pendingOrders' })
}
</script>

<template>
  <div class="success-message">
    <div class="success-icon">🎁</div>
    <h2 class="success-title">{{ t('giftFinder.success.title') }}</h2>
    <p class="success-description">{{ t('giftFinder.success.description') }}</p>
    <div class="success-features">
      <div class="feature-item">
        <span class="feature-icon">🔍</span>
        <span class="feature-text">{{ t('giftFinder.success.feature1') }}</span>
      </div>
      <div class="feature-item">
        <span class="feature-icon">🤖</span>
        <span class="feature-text">{{ t('giftFinder.success.feature2') }}</span>
      </div>
      <div class="feature-item">
        <span class="feature-icon">🔔</span>
        <span class="feature-text">{{ t('giftFinder.success.feature3') }}</span>
      </div>
    </div>
    <div class="button-group">
      <button class="view-pending-button" @click="goToPendingOrders">
        🔍 {{ t('giftFinder.success.viewPending') }}
      </button>
      <button class="new-search-button" @click="emit('newSearch')">
        ✨ {{ t('giftFinder.success.newSearch') }}
      </button>
    </div>
  </div>
</template>

<style scoped>
.success-message {
  text-align: center;
  padding: 4rem 2rem;
  animation: slideIn 0.5s cubic-bezier(0.23, 1, 0.32, 1);
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.success-icon {
  font-size: 5rem;
  margin-bottom: 1.5rem;
  animation: bounce 2s ease-in-out infinite;
}

@keyframes bounce {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-20px);
  }
}

.success-title {
  font-size: 2.5rem;
  font-weight: 800;
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  margin-bottom: 1rem;
  letter-spacing: -0.02em;
}

.success-description {
  font-size: 1.25rem;
  color: #374151;
  margin-bottom: 3rem;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
  line-height: 1.6;
}

.success-features {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  max-width: 500px;
  margin: 0 auto 3rem;
}

.feature-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.25rem 1.5rem;
  background: linear-gradient(135deg, rgba(99, 102, 241, 0.05) 0%, rgba(168, 85, 247, 0.05) 100%);
  border-radius: 16px;
  border: 2px solid rgba(99, 102, 241, 0.1);
  transition: all 0.3s ease;
}

.feature-item:hover {
  transform: translateX(8px);
  border-color: rgba(99, 102, 241, 0.2);
  background: linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(168, 85, 247, 0.1) 100%);
}

.feature-icon {
  font-size: 2rem;
  flex-shrink: 0;
}

.feature-text {
  font-size: 1rem;
  font-weight: 600;
  color: #1f2937;
  text-align: left;
}

.button-group {
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
}

.view-pending-button {
  padding: 1.25rem 3rem;
  font-size: 1.125rem;
  font-weight: 700;
  color: white;
  background: linear-gradient(135deg, #f97316 0%, #ea580c 100%);
  border: none;
  border-radius: 16px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.23, 1, 0.32, 1);
  box-shadow: 0 4px 12px rgba(249, 115, 22, 0.3);
}

.view-pending-button:hover {
  transform: translateY(-2px) scale(1.02);
  box-shadow: 0 8px 24px rgba(249, 115, 22, 0.4);
}

.new-search-button {
  padding: 1.25rem 3rem;
  font-size: 1.125rem;
  font-weight: 700;
  color: white;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  border-radius: 16px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.23, 1, 0.32, 1);
  box-shadow: 0 4px 12px rgba(99, 102, 241, 0.3);
}

.new-search-button:hover {
  transform: translateY(-2px) scale(1.02);
  box-shadow: 0 8px 24px rgba(99, 102, 241, 0.4);
}

@media (prefers-color-scheme: dark) {
  .success-description {
    color: #d1d5db;
  }

  .feature-item {
    background: linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(168, 85, 247, 0.1) 100%);
    border-color: rgba(99, 102, 241, 0.2);
  }

  .feature-item:hover {
    background: linear-gradient(135deg, rgba(99, 102, 241, 0.15) 0%, rgba(168, 85, 247, 0.15) 100%);
    border-color: rgba(99, 102, 241, 0.3);
  }

  .feature-text {
    color: #e5e7eb;
  }
}
</style>
