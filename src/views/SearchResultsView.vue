<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { giftSearchAPI } from '@/api/giftSearch'
import type { SearchHistoryItem } from '@/types/giftSearch'
import BaseCard from '@/components/ui/BaseCard.vue'
import BaseSkeleton from '@/components/ui/BaseSkeleton.vue'
import AppBreadcrumbs from '@/components/ui/AppBreadcrumbs.vue'
import { Sparkles } from 'lucide-vue-next'

const route = useRoute()
const { t } = useI18n()

const isLoading = ref(true)
const error = ref<string | null>(null)
const searchData = ref<SearchHistoryItem | null>(null)

const searchId = computed(() => route.params.id as string)

const breadcrumbItems = computed(() => [
  { label: t('common.dashboard'), to: { name: 'dashboard' } },
  { label: t('common.searchHistory'), to: { name: 'searchHistory' } },
  { label: t('searchResults.breadcrumb', { id: searchId.value }), to: undefined },
])

const expandedCards = ref<Set<string>>(new Set())

const toggleExpand = (asin: string) => {
  if (expandedCards.value.has(asin)) {
    expandedCards.value.delete(asin)
  } else {
    expandedCards.value.add(asin)
  }
}

const isExpanded = (asin: string) => expandedCards.value.has(asin)

const formatPrice = (price: number, currency?: string) => {
  // If no currency is provided, default to EUR
  const currencyCode = currency || 'EUR'

  try {
    return new Intl.NumberFormat(undefined, {
      style: 'currency',
      currency: currencyCode,
    }).format(price)
  } catch (error) {
    // Fallback to plain number with € symbol if currency formatting fails
    console.warn('Failed to format price:', error)
    return `€${price.toFixed(2)}`
  }
}

const loadSearchResults = async () => {
  if (!searchId.value) {
    error.value = 'No search ID provided'
    isLoading.value = false
    return
  }

  try {
    isLoading.value = true
    error.value = null

    searchData.value = await giftSearchAPI.getSearchResults(searchId.value)
  } catch (err: unknown) {
    console.error('Failed to load search results:', err)
    error.value =
      (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
      'Failed to load search results'
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  loadSearchResults()
})
</script>

<template>
  <div class="results-container">
    <!-- Breadcrumbs -->
    <AppBreadcrumbs :items="breadcrumbItems" />

    <!-- Loading State -->
    <div v-if="isLoading" class="loading-state">
      <div class="loading-header">
        <BaseSkeleton shape="rect" inner-class="h-12 w-3/4 mx-auto" />
        <BaseSkeleton shape="rect" inner-class="h-6 w-1/2 mx-auto mt-4" />
      </div>

      <div class="results-grid">
        <BaseSkeleton v-for="i in 6" :key="i" shape="rect" inner-class="h-96 w-full rounded-3xl" />
      </div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="error-state">
      <div class="error-icon">❌</div>
      <h2 class="error-title">{{ t('searchResults.error.title') }}</h2>
      <p class="error-description">{{ error }}</p>
      <router-link to="/dashboard" class="back-button">
        {{ t('searchResults.error.backToDashboard') }}
      </router-link>
    </div>

    <!-- Results -->
    <div v-else-if="searchData">
      <!-- Header -->
      <div class="results-header">
        <div class="header-icon">
          <Sparkles class="w-12 h-12" />
        </div>
        <h1 class="results-title">{{ t('searchResults.title') }}</h1>
        <p class="results-subtitle">
          {{ t('searchResults.subtitle', { count: searchData.data.recommendations.length }) }}
        </p>

        <!-- Search Context -->
        <div class="search-context">
          <div class="context-item">
            <span class="context-label">{{ t('searchResults.context.relation') }}:</span>
            <span class="context-value">{{ searchData.data.context.relation }}</span>
          </div>
          <div class="context-item">
            <span class="context-label">{{ t('searchResults.context.occasion') }}:</span>
            <span class="context-value">{{ searchData.data.context.occasion }}</span>
          </div>
          <div class="context-item">
            <span class="context-label">{{ t('searchResults.context.budget') }}:</span>
            <span class="context-value">
              €{{ searchData.data.context.budget.min }} - €{{ searchData.data.context.budget.max }}
            </span>
          </div>
          <div class="context-item">
            <span class="context-label">{{ t('searchResults.context.interests') }}:</span>
            <span class="context-value">{{ searchData.data.context.interests.join(', ') }}</span>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-if="searchData.data.recommendations.length === 0" class="empty-state">
        <div class="empty-icon">🎁</div>
        <h2 class="empty-title">{{ t('searchResults.empty.title') }}</h2>
        <p class="empty-description">{{ t('searchResults.empty.description') }}</p>
        <router-link to="/dashboard" class="back-button">
          {{ t('searchResults.empty.backToDashboard') }}
        </router-link>
      </div>

      <!-- Product Grid -->
      <div v-else class="results-grid">
        <div
          v-for="(product, index) in searchData.data.recommendations"
          :key="product.asin"
          class="product-card-wrapper"
          :style="{ animationDelay: `${index * 100}ms` }"
        >
          <div class="product-card">
            <BaseCard
              :image-src="product.image || ''"
              :image-alt="product.title || 'Product image'"
              :href="product.url || '#'"
              :target="product.url ? '_blank' : '_self'"
            >
              <template #title>
                {{ product.ai_personalized_title || product.title }}
              </template>

              <template #description>
                <div class="product-info">
                  <!-- Price and Prime Badge -->
                  <div v-if="product.price" class="price-row">
                    <span class="product-price">
                      {{ formatPrice(product.price, product.currency) }}
                    </span>
                    <span v-if="product.is_prime" class="prime-badge"> Prime </span>
                  </div>

                  <!-- Rating -->
                  <div v-if="product.rating" class="rating-row">
                    <div class="rating-stars">
                      <svg class="star-icon" fill="currentColor" viewBox="0 0 20 20">
                        <path
                          d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
                        />
                      </svg>
                      <span class="rating-value">{{ product.rating.toFixed(1) }}</span>
                    </div>
                    <span class="review-count">
                      ({{ product.review_count.toLocaleString() }} reviews)
                    </span>
                  </div>

                  <!-- AI Personalized Description -->
                  <div class="ai-description">
                    <div class="ai-badge">
                      <Sparkles class="w-3 h-3" />
                      <span>{{ t('searchResults.aiPowered') }}</span>
                    </div>
                    <p class="description-text">{{ product.ai_personalized_description }}</p>
                  </div>

                  <!-- Expandable Content -->
                  <div v-if="isExpanded(product.asin)" class="expandable-content">
                    <!-- AI Reasoning -->
                    <div class="ai-reasoning">
                      <h4 class="reasoning-title">{{ t('searchResults.whyThisGift') }}</h4>
                      <p class="reasoning-text">{{ product.ai_reasoning }}</p>
                    </div>

                    <!-- Features -->
                    <div
                      v-if="product.features && product.features.length > 0"
                      class="features-list"
                    >
                      <h4 class="features-title">{{ t('searchResults.keyFeatures') }}</h4>
                      <ul class="features">
                        <li v-for="(feature, idx) in product.features" :key="idx">
                          {{ feature }}
                        </li>
                      </ul>
                    </div>
                  </div>

                  <!-- Show More/Less Button -->
                  <button @click.prevent="toggleExpand(product.asin)" class="show-more-button">
                    {{
                      isExpanded(product.asin)
                        ? t('searchResults.showLess')
                        : t('searchResults.showMore')
                    }}
                  </button>
                </div>
              </template>
            </BaseCard>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.results-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 2rem 1rem;
}

/* Loading State */
.loading-state {
  padding: 2rem 0;
}

.loading-header {
  text-align: center;
  margin-bottom: 3rem;
}

/* Results Header */
.results-header {
  text-align: center;
  margin-bottom: 4rem;
  animation: fadeInDown 0.6s ease-out;
}

.header-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 80px;
  height: 80px;
  background: linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(168, 85, 247, 0.1) 100%);
  border-radius: 50%;
  margin-bottom: 1.5rem;
  color: #6366f1;
  animation: pulse 2s ease-in-out infinite;
}

@keyframes pulse {
  0%,
  100% {
    transform: scale(1);
    opacity: 1;
  }
  50% {
    transform: scale(1.05);
    opacity: 0.9;
  }
}

.results-title {
  font-size: 3rem;
  font-weight: 800;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  margin-bottom: 1rem;
  letter-spacing: -0.02em;
}

.results-subtitle {
  font-size: 1.25rem;
  color: #6b7280;
  margin-bottom: 2rem;
}

/* Search Context */
.search-context {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  justify-content: center;
  padding: 1.5rem;
  background: linear-gradient(135deg, rgba(99, 102, 241, 0.05) 0%, rgba(168, 85, 247, 0.05) 100%);
  border-radius: 1rem;
  max-width: 900px;
  margin: 0 auto;
}

.context-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: white;
  border-radius: 999px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.context-label {
  font-size: 0.875rem;
  font-weight: 600;
  color: #6366f1;
}

.context-value {
  font-size: 0.875rem;
  color: #374151;
  font-weight: 500;
  text-transform: capitalize;
}

/* Results Grid */
.results-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 2rem;
  animation: fadeInUp 0.6s ease-out 0.2s both;
  align-items: start;
}

.product-card-wrapper {
  animation: fadeInUp 0.6s ease-out both;
  display: flex;
}

.product-card {
  display: flex;
  flex-direction: column;
  width: 100%;
}

.product-card :deep(.card-wrapper) {
  display: flex;
  flex-direction: column;
}

.product-card :deep(.card-content) {
  display: flex;
  flex-direction: column;
  flex: 1;
}

.product-card :deep(.content-wrapper) {
  display: flex;
  flex-direction: column;
  flex-grow: 1;
}

.product-card :deep(.image-container) {
  min-height: 250px;
}

/* Product Info */
.product-info {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.price-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 0.5rem;
}

.product-price {
  font-size: 1.25rem;
  font-weight: 700;
  color: #111827;
}

.prime-badge {
  display: inline-block;
  padding: 0.25rem 0.5rem;
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
  color: white;
  font-size: 0.75rem;
  font-weight: 600;
  border-radius: 0.375rem;
  text-transform: uppercase;
  letter-spacing: 0.025em;
}

.rating-row {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.75rem;
}

.rating-stars {
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.star-icon {
  width: 1rem;
  height: 1rem;
  color: #fbbf24;
}

.rating-value {
  font-size: 0.875rem;
  font-weight: 600;
  color: #374151;
}

.review-count {
  font-size: 0.8125rem;
  color: #6b7280;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fadeInDown {
  from {
    opacity: 0;
    transform: translateY(-30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Expandable Content */
.expandable-content {
  overflow: hidden;
  animation: expandDown 0.3s ease-out forwards;
  margin-top: 0.75rem;
}

@keyframes expandDown {
  from {
    opacity: 0;
    max-height: 0;
    margin-top: 0;
  }
  to {
    opacity: 1;
    max-height: 2000px;
    margin-top: 0.75rem;
  }
}

.show-more-button {
  width: 100%;
  margin-top: 1rem;
  padding: 0.625rem 1rem;
  background: linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(168, 85, 247, 0.1) 100%);
  color: #6366f1;
  font-size: 0.875rem;
  font-weight: 600;
  border: 1px solid rgba(99, 102, 241, 0.2);
  border-radius: 0.5rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

.show-more-button:hover {
  background: linear-gradient(135deg, rgba(99, 102, 241, 0.15) 0%, rgba(168, 85, 247, 0.15) 100%);
  border-color: rgba(99, 102, 241, 0.3);
  transform: translateY(-1px);
}

/* Product Card Content */
.ai-description {
  margin-bottom: 1rem;
}

.ai-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.375rem 0.75rem;
  background: linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(168, 85, 247, 0.1) 100%);
  border-radius: 999px;
  font-size: 0.75rem;
  font-weight: 600;
  color: #6366f1;
  margin-bottom: 0.75rem;
}

.description-text {
  font-size: 0.9375rem;
  line-height: 1.6;
  color: #4b5563;
}

.ai-reasoning {
  margin-bottom: 1.5rem;
  padding: 1rem;
  background: linear-gradient(135deg, rgba(99, 102, 241, 0.05) 0%, rgba(168, 85, 247, 0.05) 100%);
  border-radius: 0.75rem;
  border-left: 3px solid #6366f1;
}

.reasoning-title {
  font-size: 0.875rem;
  font-weight: 700;
  color: #6366f1;
  margin-bottom: 0.5rem;
}

.reasoning-text {
  font-size: 0.875rem;
  line-height: 1.6;
  color: #4b5563;
}

.features-list {
  margin-top: 1rem;
}

.features-title {
  font-size: 0.875rem;
  font-weight: 700;
  color: #374151;
  margin-bottom: 0.5rem;
}

.features {
  list-style: none;
  padding: 0;
  margin: 0;
}

.features li {
  font-size: 0.8125rem;
  color: #6b7280;
  padding-left: 1.25rem;
  position: relative;
  margin-bottom: 0.375rem;
}

.features li::before {
  content: '✓';
  position: absolute;
  left: 0;
  color: #10b981;
  font-weight: 700;
}

/* Error State */
.error-state {
  text-align: center;
  padding: 4rem 2rem;
  animation: fadeInUp 0.6s ease-out;
}

.error-icon {
  font-size: 5rem;
  margin-bottom: 1.5rem;
  animation: shake 0.5s ease-in-out;
}

@keyframes shake {
  0%,
  100% {
    transform: translateX(0);
  }
  25% {
    transform: translateX(-10px);
  }
  75% {
    transform: translateX(10px);
  }
}

.error-title {
  font-size: 2rem;
  font-weight: 700;
  color: #dc2626;
  margin-bottom: 1rem;
}

.error-description {
  font-size: 1.125rem;
  color: #6b7280;
  margin-bottom: 2rem;
}

/* Empty State */
.empty-state {
  text-align: center;
  padding: 4rem 2rem;
  animation: fadeInUp 0.6s ease-out;
}

.empty-icon {
  font-size: 5rem;
  margin-bottom: 1.5rem;
}

.empty-title {
  font-size: 2rem;
  font-weight: 700;
  color: #374151;
  margin-bottom: 1rem;
}

.empty-description {
  font-size: 1.125rem;
  color: #6b7280;
  margin-bottom: 2rem;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
}

/* Back Button */
.back-button {
  display: inline-block;
  padding: 0.75rem 2rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  font-weight: 600;
  border-radius: 0.75rem;
  text-decoration: none;
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;
  box-shadow: 0 4px 6px rgba(99, 102, 241, 0.3);
}

.back-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 12px rgba(99, 102, 241, 0.4);
}

/* Dark Mode */
@media (prefers-color-scheme: dark) {
  .show-more-button {
    color: #a5b4fc;
    background: linear-gradient(135deg, rgba(99, 102, 241, 0.15) 0%, rgba(168, 85, 247, 0.15) 100%);
    border-color: rgba(99, 102, 241, 0.3);
  }

  .show-more-button:hover {
    background: linear-gradient(135deg, rgba(99, 102, 241, 0.2) 0%, rgba(168, 85, 247, 0.2) 100%);
    border-color: rgba(99, 102, 241, 0.4);
  }

  .results-subtitle {
    color: #d1d5db;
  }

  .context-item {
    background: rgba(55, 65, 81, 0.5);
  }

  .context-value {
    color: #d1d5db;
  }

  .product-price {
    color: #f3f4f6;
  }

  .rating-value {
    color: #f3f4f6;
  }

  .review-count {
    color: #d1d5db;
  }

  .description-text {
    color: #d1d5db;
  }

  .reasoning-text {
    color: #d1d5db;
  }

  .features-title {
    color: #f3f4f6;
  }

  .features li {
    color: #d1d5db;
  }

  .empty-title,
  .error-title {
    color: #f3f4f6;
  }

  .empty-description,
  .error-description {
    color: #d1d5db;
  }
}

/* Responsive */
@media (max-width: 768px) {
  .results-title {
    font-size: 2rem;
  }

  .results-subtitle {
    font-size: 1rem;
  }

  .search-context {
    flex-direction: column;
    align-items: stretch;
  }

  .context-item {
    justify-content: space-between;
  }

  .results-grid {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
}
</style>
