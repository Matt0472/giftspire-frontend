<template>
  <div>
    <div class="full-bleed -mt-8">
      <ChipsJumbotron
        :skeleton-widths="skeletonWidths"
      />
    </div>

    <!-- Step-by-Step Gift Finder -->
    <StepByStepGiftFinder />

    <!-- Divider -->
    <div class="divider-container">
      <div class="divider-line"></div>
      <div class="divider-icon">✨</div>
      <div class="divider-line"></div>
    </div>

    <!-- Suggestions Section Title -->
    <div class="suggestions-header">
      <h2 class="suggestions-title">
        {{ t('dashboard.suggestions.title') }}
      </h2>
      <p class="suggestions-subtitle">
        {{ t('dashboard.suggestions.subtitle') }}
      </p>
    </div>

    <!-- Loading State - Simple line skeletons -->
    <div v-if="isLoading" class="space-y-6">
      <BaseSkeleton shape="rect" inner-class="h-8 w-64" />
      <BaseSkeleton shape="rect" inner-class="h-6 w-96" />
      <BaseSkeleton shape="rect" inner-class="h-6 w-80" />
      <BaseSkeleton shape="rect" inner-class="h-6 w-72" />
      <BaseSkeleton shape="rect" inner-class="h-6 w-88" />
    </div>

    <!-- Trending Sections - Hidden but mounted during loading -->
    <div :class="{ 'opacity-0 h-0 overflow-hidden': isLoading }">
      <TrendingProducts
        category="tech"
        :limit="4"
        title="Tech & Gadgets"
        gradient-variant="variant1"
        :animation-delay="0"
        @loaded="handleSectionLoaded"
      />

      <TrendingProducts
        category="fashion"
        :limit="4"
        title="Fashion & Accessories"
        gradient-variant="variant2"
        :animation-delay="100"
        @loaded="handleSectionLoaded"
      />

      <TrendingProducts
        category="home"
        :limit="4"
        title="Home & Kitchen"
        gradient-variant="variant3"
        :animation-delay="200"
        @loaded="handleSectionLoaded"
      />

      <TrendingProducts
        category="sports"
        :limit="4"
        title="Sports & Outdoors"
        gradient-variant="variant4"
        :animation-delay="300"
        @loaded="handleSectionLoaded"
      />

      <TrendingProducts
        category="books"
        :limit="4"
        title="Books & Hobbies"
        gradient-variant="variant5"
        :animation-delay="400"
        @loaded="handleSectionLoaded"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import ChipsJumbotron from '@/components/Dashboard/ChipsJumbotron.vue'
import StepByStepGiftFinder from '@/components/Dashboard/StepByStepGiftFinder.vue'
import TrendingProducts from '@/components/Dashboard/TrendingProducts.vue'
import BaseSkeleton from '@/components/ui/BaseSkeleton.vue'

const { t } = useI18n()

const skeletonWidths = ['w-24','w-28','w-32','w-20','w-36','w-24','w-28','w-20','w-32','w-24','w-28','w-36']

const isLoading = ref(true)
const loadedSections = ref(0)
const totalSections = 5

const handleSectionLoaded = () => {
  loadedSections.value++
  if (loadedSections.value >= totalSections) {
    isLoading.value = false
  }
}
</script>

<style scoped>
.full-bleed {
  width: 100vw;
  margin-left: calc(-50vw + 50%);
  margin-right: calc(-50vw + 50%);
  max-width: 100vw;
}

/* Divider */
.divider-container {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1.5rem;
  margin: 4rem auto;
  max-width: 800px;
  padding: 0 1.5rem;
}

.divider-line {
  flex: 1;
  height: 2px;
  background: linear-gradient(
    90deg,
    transparent 0%,
    rgba(99, 102, 241, 0.3) 50%,
    transparent 100%
  );
  border-radius: 999px;
}

.divider-icon {
  font-size: 1.5rem;
  padding: 0.75rem 1.25rem;
  background: linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(168, 85, 247, 0.1) 100%);
  border: 2px solid rgba(99, 102, 241, 0.2);
  border-radius: 999px;
  animation: pulse 3s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% {
    transform: scale(1);
    opacity: 1;
  }
  50% {
    transform: scale(1.1);
    opacity: 0.8;
  }
}

@media (prefers-color-scheme: dark) {
  .divider-line {
    background: linear-gradient(
      90deg,
      transparent 0%,
      rgba(139, 92, 246, 0.4) 50%,
      transparent 100%
    );
  }

  .divider-icon {
    background: linear-gradient(135deg, rgba(99, 102, 241, 0.2) 0%, rgba(168, 85, 247, 0.2) 100%);
    border-color: rgba(99, 102, 241, 0.3);
  }
}

/* Suggestions Section Header */
.suggestions-header {
  text-align: center;
  margin-bottom: 3rem;
  padding: 0 1.5rem;
}

.suggestions-title {
  font-size: 2.25rem;
  font-weight: 800;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  margin-bottom: 0.75rem;
  letter-spacing: -0.02em;
}

.suggestions-subtitle {
  font-size: 1.125rem;
  color: #6b7280;
  font-weight: 500;
  max-width: 600px;
  margin: 0 auto;
}

@media (prefers-color-scheme: dark) {
  .suggestions-subtitle {
    color: #d1d5db;
  }
}
</style>
