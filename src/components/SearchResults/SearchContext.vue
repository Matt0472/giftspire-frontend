<script setup lang="ts">
import { useI18n } from 'vue-i18n'

interface SearchContextData {
  relation: string
  occasion: string
  budget: {
    min: number
    max: number
  }
  interests: string[]
}

interface Props {
  context: SearchContextData
}

const props = defineProps<Props>()
const { t } = useI18n()
</script>

<template>
  <div class="search-context">
    <div class="context-item">
      <span class="context-label">{{ t('searchResults.context.relation') }}:</span>
      <span class="context-value">{{ context.relation }}</span>
    </div>
    <div class="context-item">
      <span class="context-label">{{ t('searchResults.context.occasion') }}:</span>
      <span class="context-value">{{ context.occasion }}</span>
    </div>
    <div class="context-item">
      <span class="context-label">{{ t('searchResults.context.budget') }}:</span>
      <span class="context-value">
        €{{ context.budget.min }} - €{{ context.budget.max }}
      </span>
    </div>
    <div class="context-item">
      <span class="context-label">{{ t('searchResults.context.interests') }}:</span>
      <span class="context-value">{{ context.interests.join(', ') }}</span>
    </div>
  </div>
</template>

<style scoped>
.search-context {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  justify-content: center;
  padding: 1.5rem;
  background: linear-gradient(135deg, #e0e7ff 0%, #ddd6fe 100%);
  border-radius: 1rem;
  max-width: 900px;
  margin: 0 auto;
  box-shadow: 0 4px 6px rgba(79, 70, 229, 0.1);
}

.context-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.625rem 1.125rem;
  background: white;
  border-radius: 999px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  border: 1px solid rgba(79, 70, 229, 0.15);
}

.context-label {
  font-size: 0.875rem;
  font-weight: 700;
  color: #4f46e5;
}

.context-value {
  font-size: 0.875rem;
  color: #1f2937;
  font-weight: 600;
  text-transform: capitalize;
}

@media (prefers-color-scheme: dark) {
  .search-context {
    background: linear-gradient(135deg, rgba(99, 102, 241, 0.08) 0%, rgba(168, 85, 247, 0.08) 100%);
  }

  .context-item {
    background: rgba(55, 65, 81, 0.8);
  }

  .context-label {
    color: #a5b4fc;
  }

  .context-value {
    color: #e5e7eb;
  }
}

@media (max-width: 768px) {
  .search-context {
    flex-direction: column;
    align-items: stretch;
  }

  .context-item {
    justify-content: space-between;
  }
}
</style>
