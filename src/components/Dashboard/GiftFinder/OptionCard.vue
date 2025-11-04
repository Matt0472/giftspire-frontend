<script setup lang="ts">
import { useI18n } from 'vue-i18n'

interface Props {
  icon: string
  labelKey: string
  value: string
  selected: boolean
}

const props = defineProps<Props>()
const { t } = useI18n()

const emit = defineEmits<{
  select: [value: string]
}>()
</script>

<template>
  <button
    class="option-card"
    :class="{ selected: selected }"
    @click="emit('select', value)"
  >
    <span class="option-icon">{{ icon }}</span>
    <span class="option-label">{{ t(labelKey) }}</span>
  </button>
</template>

<style scoped>
.option-card {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 1rem 0.75rem;
  background: white;
  border: 2px solid #e5e7eb;
  border-radius: 14px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.23, 1, 0.32, 1);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
}

.option-card:hover {
  transform: translateY(-4px);
  border-color: #667eea;
  box-shadow: 0 8px 24px rgba(99, 102, 241, 0.15);
}

.option-card.selected {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-color: #667eea;
  box-shadow: 0 8px 24px rgba(99, 102, 241, 0.3);
  transform: translateY(-4px) scale(1.02);
}

.option-icon {
  font-size: 2rem;
  transition: transform 0.3s ease;
}

.option-card:hover .option-icon,
.option-card.selected .option-icon {
  transform: scale(1.15);
}

.option-label {
  font-size: 0.8125rem;
  font-weight: 600;
  color: #374151;
  text-align: center;
  transition: color 0.3s ease;
  line-height: 1.2;
}

.option-card.selected .option-label {
  color: white;
}

@media (prefers-color-scheme: dark) {
  .option-card {
    background: #1f2937;
    border-color: #374151;
  }

  .option-label {
    color: #e5e7eb;
  }

  .option-card.selected .option-label {
    color: white;
  }
}
</style>
