<script setup lang="ts">
import { useI18n } from 'vue-i18n'

interface Props {
  currentStep: number
  totalSteps: number
}

const props = defineProps<Props>()
const { t } = useI18n()
</script>

<template>
  <div class="progress-container">
    <div class="progress-bar">
      <div class="progress-fill" :style="{ width: `${(currentStep / totalSteps) * 100}%` }"></div>
    </div>
    <div class="progress-steps">
      <div
        v-for="step in totalSteps"
        :key="step"
        class="progress-step"
        :class="{ active: step <= currentStep, completed: step < currentStep }"
      >
        <div class="step-circle">
          <span v-if="step < currentStep">✓</span>
          <span v-else>{{ step }}</span>
        </div>
        <span class="step-label">{{ t(`giftFinder.steps.step${step}`) }}</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.progress-container {
  margin-bottom: 3rem;
}

.progress-bar {
  width: 100%;
  height: 6px;
  background: rgba(99, 102, 241, 0.1);
  border-radius: 999px;
  overflow: hidden;
  margin-bottom: 1.5rem;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
  transition: width 0.5s cubic-bezier(0.23, 1, 0.32, 1);
  border-radius: 999px;
}

.progress-steps {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
}

.progress-step {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
}

.step-circle {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 0.875rem;
  background: #e5e7eb;
  color: #9ca3af;
  transition: all 0.3s ease;
}

.progress-step.active .step-circle {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  box-shadow: 0 4px 12px rgba(99, 102, 241, 0.4);
  transform: scale(1.1);
}

.progress-step.completed .step-circle {
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  color: white;
}

.step-label {
  font-size: 0.75rem;
  font-weight: 600;
  color: #9ca3af;
  text-align: center;
  transition: color 0.3s ease;
}

.progress-step.active .step-label {
  color: #667eea;
}

.progress-step.completed .step-label {
  color: #10b981;
}

@media (prefers-color-scheme: dark) {
  .step-circle {
    background: #374151;
    color: #6b7280;
  }

  .step-label {
    color: #6b7280;
  }

  .progress-step.active .step-label {
    color: #a5b4fc;
  }
}
</style>
