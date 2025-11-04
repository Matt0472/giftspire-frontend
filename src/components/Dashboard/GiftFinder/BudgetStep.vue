<script setup lang="ts">
import { useI18n } from 'vue-i18n'

interface Props {
  minBudget: number
  maxBudget: number
}

const props = defineProps<Props>()
const { t } = useI18n()

const emit = defineEmits<{
  'update:minBudget': [value: number]
  'update:maxBudget': [value: number]
}>()
</script>

<template>
  <div class="step-panel">
    <h3 class="step-title">{{ t('giftFinder.step3.title') }}</h3>
    <p class="step-description">{{ t('giftFinder.step3.description') }}</p>
    <div class="budget-container">
      <div class="budget-display">
        <div class="budget-value">
          <span class="budget-label">{{ t('giftFinder.step3.min') }}</span>
          <span class="budget-amount">${{ minBudget }}</span>
        </div>
        <div class="budget-separator">—</div>
        <div class="budget-value">
          <span class="budget-label">{{ t('giftFinder.step3.max') }}</span>
          <span class="budget-amount">${{ maxBudget }}</span>
        </div>
      </div>
      <div class="budget-sliders">
        <div class="slider-group">
          <label class="slider-label">{{ t('giftFinder.step3.min') }}: ${{ minBudget }}</label>
          <input
            :value="minBudget"
            @input="emit('update:minBudget', Number(($event.target as HTMLInputElement).value))"
            type="range"
            min="10"
            max="500"
            step="10"
            class="budget-slider"
          />
        </div>
        <div class="slider-group">
          <label class="slider-label">{{ t('giftFinder.step3.max') }}: ${{ maxBudget }}</label>
          <input
            :value="maxBudget"
            @input="emit('update:maxBudget', Number(($event.target as HTMLInputElement).value))"
            type="range"
            min="20"
            max="1000"
            step="10"
            class="budget-slider"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.step-panel {
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

.step-title {
  font-size: 1.875rem;
  font-weight: 700;
  color: #111827;
  margin-bottom: 0.5rem;
  text-align: center;
}

.step-description {
  font-size: 1rem;
  color: #6b7280;
  text-align: center;
  margin-bottom: 1.5rem;
}

.budget-container {
  max-width: 600px;
  margin: 0 auto;
  padding: 2rem;
  background: linear-gradient(135deg, rgba(99, 102, 241, 0.05) 0%, rgba(168, 85, 247, 0.05) 100%);
  border-radius: 24px;
  border: 2px solid rgba(99, 102, 241, 0.1);
}

.budget-display {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 2rem;
  margin-bottom: 3rem;
}

.budget-value {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
}

.budget-label {
  font-size: 0.875rem;
  font-weight: 600;
  color: #6b7280;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.budget-amount {
  font-size: 2.5rem;
  font-weight: 800;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
}

.budget-separator {
  font-size: 1.5rem;
  color: #d1d5db;
  font-weight: 300;
}

.budget-sliders {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.slider-group {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.slider-label {
  font-size: 0.875rem;
  font-weight: 600;
  color: #374151;
}

.budget-slider {
  width: 100%;
  height: 8px;
  border-radius: 999px;
  outline: none;
  -webkit-appearance: none;
  appearance: none;
  background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
  opacity: 0.7;
  transition: opacity 0.2s;
}

.budget-slider:hover {
  opacity: 1;
}

.budget-slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: white;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(99, 102, 241, 0.4);
  border: 3px solid #667eea;
  transition: transform 0.2s;
}

.budget-slider::-webkit-slider-thumb:hover {
  transform: scale(1.2);
}

.budget-slider::-moz-range-thumb {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: white;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(99, 102, 241, 0.4);
  border: 3px solid #667eea;
  transition: transform 0.2s;
}

.budget-slider::-moz-range-thumb:hover {
  transform: scale(1.2);
}

@media (prefers-color-scheme: dark) {
  .step-title {
    color: #f9fafb;
  }

  .step-description {
    color: #d1d5db;
  }

  .budget-container {
    background: linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(168, 85, 247, 0.1) 100%);
  }

  .slider-label {
    color: #e5e7eb;
  }
}
</style>
