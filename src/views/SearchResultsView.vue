<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { giftSearchAPI } from '@/api/giftSearch'
import type { SearchHistoryItem } from '@/types/giftSearch'
import BaseSkeleton from '@/components/ui/BaseSkeleton.vue'
import AppBreadcrumbs from '@/components/ui/AppBreadcrumbs.vue'
import SearchContext from '@/components/SearchResults/SearchContext.vue'
import ProductResultCard from '@/components/SearchResults/ProductResultCard.vue'
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
        <SearchContext :context="searchData.data.context" />
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
        <ProductResultCard
          v-for="(product, index) in searchData.data.recommendations"
          :key="product.asin"
          :product="product"
          :animation-delay="index * 100"
        />
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

/* Results Grid */
.results-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 2rem;
  animation: fadeInUp 0.6s ease-out 0.2s both;
  align-items: start;
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
  .results-subtitle {
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

  .results-grid {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
}
</style>
