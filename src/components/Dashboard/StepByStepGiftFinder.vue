<script setup lang="ts">
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useGiftSearch } from '@/composables/useGiftSearch'
import type { Relation, Occasion, AgeGroup, Gender, GiftSearchRequest } from '@/types/giftSearch'

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

// Relations with icons
const relations = [
  { value: 'girlfriend' as Relation, icon: '💝', labelKey: 'giftFinder.relations.girlfriend' },
  { value: 'boyfriend' as Relation, icon: '💙', labelKey: 'giftFinder.relations.boyfriend' },
  { value: 'wife' as Relation, icon: '💍', labelKey: 'giftFinder.relations.wife' },
  { value: 'husband' as Relation, icon: '🤵', labelKey: 'giftFinder.relations.husband' },
  { value: 'mother' as Relation, icon: '👩', labelKey: 'giftFinder.relations.mother' },
  { value: 'father' as Relation, icon: '👨', labelKey: 'giftFinder.relations.father' },
  { value: 'friend' as Relation, icon: '🤝', labelKey: 'giftFinder.relations.friend' },
  { value: 'colleague' as Relation, icon: '💼', labelKey: 'giftFinder.relations.colleague' },
  { value: 'brother' as Relation, icon: '👦', labelKey: 'giftFinder.relations.brother' },
  { value: 'sister' as Relation, icon: '👧', labelKey: 'giftFinder.relations.sister' },
  { value: 'daughter' as Relation, icon: '👧', labelKey: 'giftFinder.relations.daughter' },
  { value: 'son' as Relation, icon: '👦', labelKey: 'giftFinder.relations.son' },
  { value: 'boss' as Relation, icon: '👔', labelKey: 'giftFinder.relations.boss' },
  { value: 'coworker' as Relation, icon: '🤝', labelKey: 'giftFinder.relations.coworker' },
  { value: 'neighbor' as Relation, icon: '🏘️', labelKey: 'giftFinder.relations.neighbor' },
  { value: 'teacher' as Relation, icon: '📚', labelKey: 'giftFinder.relations.teacher' }
]

// Occasions with icons
const occasions = [
  { value: 'birthday' as Occasion, icon: '🎂', labelKey: 'giftFinder.occasions.birthday' },
  { value: 'christmas' as Occasion, icon: '🎄', labelKey: 'giftFinder.occasions.christmas' },
  { value: 'valentine' as Occasion, icon: '💘', labelKey: 'giftFinder.occasions.valentine' },
  { value: 'anniversary' as Occasion, icon: '💑', labelKey: 'giftFinder.occasions.anniversary' },
  { value: 'graduation' as Occasion, icon: '🎓', labelKey: 'giftFinder.occasions.graduation' },
  { value: 'wedding' as Occasion, icon: '💒', labelKey: 'giftFinder.occasions.wedding' },
  { value: 'mothers_day' as Occasion, icon: '🌷', labelKey: 'giftFinder.occasions.mothersDay' },
  { value: 'fathers_day' as Occasion, icon: '👔', labelKey: 'giftFinder.occasions.fathersDay' },
  { value: 'housewarming' as Occasion, icon: '🏠', labelKey: 'giftFinder.occasions.housewarming' },
  { value: 'baby_shower' as Occasion, icon: '🍼', labelKey: 'giftFinder.occasions.babyShower' },
  { value: 'retirement' as Occasion, icon: '🏖️', labelKey: 'giftFinder.occasions.retirement' },
  { value: 'promotion' as Occasion, icon: '📈', labelKey: 'giftFinder.occasions.promotion' },
  { value: 'just_because' as Occasion, icon: '💫', labelKey: 'giftFinder.occasions.justBecause' }
]

// Interests with icons
const interests = [
  { value: 'technology', icon: '💻', labelKey: 'giftFinder.interests.technology' },
  { value: 'gadgets', icon: '📱', labelKey: 'giftFinder.interests.gadgets' },
  { value: 'fashion', icon: '👗', labelKey: 'giftFinder.interests.fashion' },
  { value: 'beauty', icon: '💄', labelKey: 'giftFinder.interests.beauty' },
  { value: 'sports', icon: '⚽', labelKey: 'giftFinder.interests.sports' },
  { value: 'fitness', icon: '💪', labelKey: 'giftFinder.interests.fitness' },
  { value: 'gaming', icon: '🎮', labelKey: 'giftFinder.interests.gaming' },
  { value: 'books', icon: '📚', labelKey: 'giftFinder.interests.books' },
  { value: 'music', icon: '🎵', labelKey: 'giftFinder.interests.music' },
  { value: 'cooking', icon: '🍳', labelKey: 'giftFinder.interests.cooking' },
  { value: 'travel', icon: '✈️', labelKey: 'giftFinder.interests.travel' },
  { value: 'art', icon: '🎨', labelKey: 'giftFinder.interests.art' },
  { value: 'photography', icon: '📷', labelKey: 'giftFinder.interests.photography' },
  { value: 'outdoor', icon: '🏕️', labelKey: 'giftFinder.interests.outdoor' },
  { value: 'pets', icon: '🐾', labelKey: 'giftFinder.interests.pets' },
  { value: 'home-decor', icon: '🏡', labelKey: 'giftFinder.interests.homeDecor' }
]

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

function toggleInterest(value: string) {
  const index = selectedInterests.value.indexOf(value)
  if (index > -1) {
    selectedInterests.value.splice(index, 1)
  } else {
    selectedInterests.value.push(value)
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
    <div v-if="searchSubmitted" class="success-message">
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
      <button class="new-search-button" @click="startNewSearch">
        ✨ {{ t('giftFinder.success.newSearch') }}
      </button>
    </div>

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

    <!-- Step Content -->
    <div class="step-content">
      <!-- Step 1: Who is it for? -->
      <div v-if="currentStep === 1" class="step-panel">
        <h3 class="step-title">{{ t('giftFinder.step1.title') }}</h3>
        <p class="step-description">{{ t('giftFinder.step1.description') }}</p>
        <div class="options-grid">
          <button
            v-for="relation in relations"
            :key="relation.value"
            class="option-card"
            :class="{ selected: selectedRelation === relation.value }"
            @click="selectedRelation = relation.value"
          >
            <span class="option-icon">{{ relation.icon }}</span>
            <span class="option-label">{{ t(relation.labelKey) }}</span>
          </button>
        </div>
      </div>

      <!-- Step 2: What's the occasion? -->
      <div v-if="currentStep === 2" class="step-panel">
        <h3 class="step-title">{{ t('giftFinder.step2.title') }}</h3>
        <p class="step-description">{{ t('giftFinder.step2.description') }}</p>
        <div class="options-grid">
          <button
            v-for="occasion in occasions"
            :key="occasion.value"
            class="option-card"
            :class="{ selected: selectedOccasion === occasion.value }"
            @click="selectedOccasion = occasion.value"
          >
            <span class="option-icon">{{ occasion.icon }}</span>
            <span class="option-label">{{ t(occasion.labelKey) }}</span>
          </button>
        </div>
      </div>

      <!-- Step 3: Budget -->
      <div v-if="currentStep === 3" class="step-panel">
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
                v-model.number="minBudget"
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
                v-model.number="maxBudget"
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

      <!-- Step 4: Interests -->
      <div v-if="currentStep === 4" class="step-panel">
        <h3 class="step-title">{{ t('giftFinder.step4.title') }}</h3>
        <p class="step-description">{{ t('giftFinder.step4.description') }}</p>
        <div class="options-grid">
          <button
            v-for="interest in interests"
            :key="interest.value"
            class="option-card"
            :class="{ selected: selectedInterests.includes(interest.value) }"
            @click="toggleInterest(interest.value)"
          >
            <span class="option-icon">{{ interest.icon }}</span>
            <span class="option-label">{{ t(interest.labelKey) }}</span>
          </button>
        </div>
      </div>
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

/* Progress Bar */
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

/* Step Content */
.step-content {
  margin-bottom: 2rem;
}

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

@media (prefers-color-scheme: dark) {
  .step-title {
    color: #f9fafb;
  }

  .step-description {
    color: #d1d5db;
  }
}

/* Options Grid */
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

/* Budget Section */
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
  .budget-container {
    background: linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(168, 85, 247, 0.1) 100%);
  }

  .slider-label {
    color: #e5e7eb;
  }
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

/* Success Message */
.success-message {
  text-align: center;
  padding: 4rem 2rem;
  animation: slideIn 0.5s cubic-bezier(0.23, 1, 0.32, 1);
}

.success-icon {
  font-size: 5rem;
  margin-bottom: 1.5rem;
  animation: bounce 2s ease-in-out infinite;
}

@keyframes bounce {
  0%, 100% {
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
  color: #6b7280;
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
  color: #374151;
  text-align: left;
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
