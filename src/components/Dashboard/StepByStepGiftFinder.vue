<script setup lang="ts">
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useGiftSearch } from '@/composables/useGiftSearch'
import type { Relation, Occasion, AgeGroup, Gender, GiftSearchRequest } from '@/types/giftSearch'
import ProgressStepper from './GiftFinder/ProgressStepper.vue'
import SuccessMessage from './GiftFinder/SuccessMessage.vue'
import RelationStep from './GiftFinder/RelationStep.vue'
import OccasionStep from './GiftFinder/OccasionStep.vue'
import BudgetStep from './GiftFinder/BudgetStep.vue'
import InterestsStep from './GiftFinder/InterestsStep.vue'

const { t, locale } = useI18n()
const { search, isLoading } = useGiftSearch()

// Step management
const currentStep = ref(1)
const totalSteps = 4
const searchSubmitted = ref(false)

// Form data
const selectedRelation = ref<Relation | null>(null)
const selectedOccasion = ref<Occasion | null>(null)
const minBudget = ref(20)
const maxBudget = ref(100)
const selectedInterests = ref<string[]>([])
const selectedAgeGroup = ref<AgeGroup | null>(null)
const selectedGender = ref<Gender | null>(null)

const canGoNext = computed(() => {
  if (currentStep.value === 1) return selectedRelation.value !== null
  if (currentStep.value === 2) return selectedOccasion.value !== null
  if (currentStep.value === 3) return minBudget.value < maxBudget.value
  if (currentStep.value === 4) return selectedInterests.value.length > 0
  return false
})

function nextStep() {
  if (canGoNext.value && currentStep.value < totalSteps) {
    currentStep.value++
  }
}

function prevStep() {
  if (currentStep.value > 1) {
    currentStep.value--
  }
}

async function handleSearch() {
  if (!selectedRelation.value || !selectedOccasion.value) return

  const request: GiftSearchRequest = {
    relation: selectedRelation.value,
    occasion: selectedOccasion.value,
    min_budget: minBudget.value,
    max_budget: maxBudget.value,
    interests: selectedInterests.value.length > 0 ? selectedInterests.value : ['general'],
    age_group: selectedAgeGroup.value || undefined,
    gender: selectedGender.value || undefined,
    output_language: locale.value === 'it' ? 'Italian' : 'English'
  }

  await search(request)
  searchSubmitted.value = true
}

function startNewSearch() {
  searchSubmitted.value = false
  currentStep.value = 1
  selectedRelation.value = null
  selectedOccasion.value = null
  minBudget.value = 20
  maxBudget.value = 100
  selectedInterests.value = []
  selectedAgeGroup.value = null
  selectedGender.value = null
}
</script>

<template>
  <div class="gift-finder-container">
    <!-- Success Message -->
    <SuccessMessage v-if="searchSubmitted" @new-search="startNewSearch" />

    <!-- Stepper -->
    <div v-else>
      <!-- Header -->
      <div class="finder-header">
        <h2 class="finder-title">
          ✨ {{ t('giftFinder.title') }}
        </h2>
        <p class="finder-subtitle">
          {{ t('giftFinder.subtitle') }}
        </p>
      </div>

      <!-- Progress Bar -->
      <ProgressStepper :current-step="currentStep" :total-steps="totalSteps" />

      <!-- Step Content -->
      <div class="step-content">
        <RelationStep v-if="currentStep === 1" v-model="selectedRelation" />
        <OccasionStep v-if="currentStep === 2" v-model="selectedOccasion" />
        <BudgetStep
          v-if="currentStep === 3"
          :min-budget="minBudget"
          :max-budget="maxBudget"
          @update:min-budget="minBudget = $event"
          @update:max-budget="maxBudget = $event"
        />
        <InterestsStep v-if="currentStep === 4" v-model="selectedInterests" />
      </div>

      <!-- Navigation -->
      <div class="navigation">
        <button
          class="nav-button nav-button-secondary"
          :disabled="currentStep === 1"
          @click="prevStep"
        >
          ← {{ t('giftFinder.navigation.back') }}
        </button>

        <button
          v-if="currentStep < totalSteps"
          class="nav-button nav-button-primary"
          :disabled="!canGoNext"
          @click="nextStep"
        >
          {{ t('giftFinder.navigation.next') }} →
        </button>

        <button
          v-else
          class="nav-button nav-button-cta"
          :disabled="!canGoNext || isLoading"
          @click="handleSearch"
        >
          <span v-if="!isLoading">🎁 {{ t('giftFinder.navigation.findGifts') }}</span>
          <span v-else>{{ t('giftFinder.navigation.searching') }}...</span>
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.gift-finder-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 3rem 1.5rem;
}

/* Header */
.finder-header {
  text-align: center;
  margin-bottom: 3rem;
}

.finder-title {
  font-size: 2.5rem;
  font-weight: 800;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  margin-bottom: 0.75rem;
  letter-spacing: -0.02em;
}

.finder-subtitle {
  font-size: 1.125rem;
  color: #6b7280;
  font-weight: 500;
}

@media (prefers-color-scheme: dark) {
  .finder-subtitle {
    color: #d1d5db;
  }
}

/* Step Content */
.step-content {
  margin-bottom: 2rem;
}

/* Navigation */
.navigation {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  margin-top: 1.5rem;
}

.nav-button {
  flex: 1;
  max-width: 300px;
  padding: 1rem 2rem;
  font-size: 1rem;
  font-weight: 700;
  border-radius: 16px;
  border: none;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.23, 1, 0.32, 1);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.nav-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none !important;
}

.nav-button-secondary {
  background: white;
  color: #667eea;
  border: 2px solid #667eea;
}

.nav-button-secondary:hover:not(:disabled) {
  background: #667eea;
  color: white;
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(99, 102, 241, 0.3);
}

.nav-button-primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.nav-button-primary:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(99, 102, 241, 0.4);
}

.nav-button-cta {
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  color: white;
  font-size: 1.125rem;
}

.nav-button-cta:hover:not(:disabled) {
  transform: translateY(-2px) scale(1.02);
  box-shadow: 0 12px 32px rgba(16, 185, 129, 0.4);
}

@media (prefers-color-scheme: dark) {
  .nav-button-secondary {
    background: #1f2937;
    color: #a5b4fc;
    border-color: #4f46e5;
  }

  .nav-button-secondary:hover:not(:disabled) {
    background: #4f46e5;
    color: white;
  }
}

@media (max-width: 768px) {
  .navigation {
    flex-direction: column;
  }

  .nav-button {
    max-width: 100%;
  }
}
</style>
