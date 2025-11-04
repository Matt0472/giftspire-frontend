<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import OptionCard from './OptionCard.vue'
import { interests } from './giftFinderConfig'

interface Props {
  modelValue: string[]
}

const props = defineProps<Props>()
const { t } = useI18n()

const emit = defineEmits<{
  'update:modelValue': [value: string[]]
}>()

const toggleInterest = (value: string) => {
  const newInterests = [...props.modelValue]
  const index = newInterests.indexOf(value)

  if (index > -1) {
    newInterests.splice(index, 1)
  } else {
    newInterests.push(value)
  }

  emit('update:modelValue', newInterests)
}
</script>

<template>
  <div class="step-panel">
    <h3 class="step-title">{{ t('giftFinder.step4.title') }}</h3>
    <p class="step-description">{{ t('giftFinder.step4.description') }}</p>
    <div class="options-grid">
      <OptionCard
        v-for="interest in interests"
        :key="interest.value"
        :icon="interest.icon"
        :label-key="interest.labelKey"
        :value="interest.value"
        :selected="modelValue.includes(interest.value)"
        @select="toggleInterest"
      />
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

.options-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(110px, 1fr));
  gap: 0.75rem;
}

@media (max-width: 768px) {
  .options-grid {
    grid-template-columns: repeat(auto-fill, minmax(90px, 1fr));
  }
}

@media (prefers-color-scheme: dark) {
  .step-title {
    color: #f9fafb;
  }

  .step-description {
    color: #d1d5db;
  }
}
</style>
