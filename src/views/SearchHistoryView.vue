<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { giftSearchAPI } from '@/api/giftSearch'
import type { SearchHistoryResponse } from '@/types/giftSearch'
import BaseSkeleton from '@/components/ui/BaseSkeleton.vue'
import { Sparkles, Calendar, ArrowRight } from 'lucide-vue-next'

const router = useRouter()
const { t } = useI18n()

const isLoading = ref(true)
const error = ref<string | null>(null)
const searchHistory = ref<SearchHistoryResponse | null>(null)
const currentPage = ref(1)

const loadSearchHistory = async (page: number = 1) => {
  try {
    isLoading.value = true
    error.value = null
    const response = await giftSearchAPI.getSearchHistory(page)
    searchHistory.value = response
    currentPage.value = page
  } catch (err: unknown) {
    console.error('Failed to load search history:', err)
    error.value = (err as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Failed to load search history'
  } finally {
    isLoading.value = false
  }
}

const viewSearchResults = (searchId: number) => {
  router.push({ name: 'searchResults', params: { id: searchId.toString() } })
}

const nextPage = () => {
  if (searchHistory.value && currentPage.value < searchHistory.value.meta.last_page) {
    loadSearchHistory(currentPage.value + 1)
  }
}

const prevPage = () => {
  if (currentPage.value > 1) {
    loadSearchHistory(currentPage.value - 1)
  }
}

const goToPage = (page: number) => {
  loadSearchHistory(page)
}

onMounted(() => {
  loadSearchHistory()
})
</script>

<template>
  <div class="history-container">
    <!-- Loading State -->
    <div v-if="isLoading" class="loading-state">
      <div class="loading-header">
        <BaseSkeleton shape="rect" inner-class="h-12 w-3/4 mx-auto" />
        <BaseSkeleton shape="rect" inner-class="h-6 w-1/2 mx-auto mt-4" />
      </div>

      <div class="history-grid">
        <BaseSkeleton
          v-for="i in 6"
          :key="i"
          shape="rect"
          inner-class="h-64 w-full rounded-2xl"
        />
      </div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="error-state">
      <div class="error-icon">❌</div>
      <h2 class="error-title">{{ t('searchHistory.error.title') }}</h2>
      <p class="error-description">{{ error }}</p>
      <router-link to="/dashboard" class="back-button">
        {{ t('searchHistory.error.backToDashboard') }}
      </router-link>
    </div>

    <!-- History List -->
    <div v-else-if="searchHistory">
      <!-- Header -->
      <div class="history-header">
        <div class="header-icon">
          <Sparkles class="w-12 h-12" />
        </div>
        <h1 class="history-title">{{ t('searchHistory.title') }}</h1>
        <p class="history-subtitle">
          {{ t('searchHistory.subtitle', { count: searchHistory.meta.total }) }}
        </p>
      </div>

      <!-- Empty State -->
      <div v-if="searchHistory.data.length === 0" class="empty-state">
        <div class="empty-icon">🎁</div>
        <h2 class="empty-title">{{ t('searchHistory.empty.title') }}</h2>
        <p class="empty-description">{{ t('searchHistory.empty.description') }}</p>
        <router-link to="/dashboard" class="back-button">
          {{ t('searchHistory.empty.startSearching') }}
        </router-link>
      </div>

      <!-- Search History Grid -->
      <div v-else>
        <div class="history-grid">
          <div
            v-for="(item, index) in searchHistory.data"
            :key="item.id"
            class="history-card"
            :style="{ animationDelay: `${index * 100}ms` }"
            @click="viewSearchResults(item.id)"
          >
            <div class="card-header">
              <div class="card-icon">
                <Sparkles class="w-6 h-6" />
              </div>
              <div class="card-info">
                <h3 class="card-title">
                  {{ t('searchHistory.searchFor') }} {{ item.data.context.relation }}
                </h3>
                <p class="card-subtitle">
                  <Calendar class="w-4 h-4 inline" />
                  {{ item.data.context.occasion }}
                </p>
              </div>
            </div>

            <div class="card-body">
              <div class="card-detail">
                <span class="detail-label">{{ t('searchHistory.budget') }}:</span>
                <span class="detail-value">
                  €{{ item.data.context.budget.min }} - €{{ item.data.context.budget.max }}
                </span>
              </div>
              <div class="card-detail">
                <span class="detail-label">{{ t('searchHistory.interests') }}:</span>
                <span class="detail-value">{{ item.data.context.interests.join(', ') }}</span>
              </div>
              <div class="card-detail">
                <span class="detail-label">{{ t('searchHistory.results') }}:</span>
                <span class="detail-value">{{ item.data.recommendations.length }}</span>
              </div>
            </div>

            <div class="card-footer">
              <button class="view-button">
                {{ t('searchHistory.viewResults') }}
                <ArrowRight class="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        <!-- Pagination -->
        <div v-if="searchHistory.meta.last_page > 1" class="pagination">
          <button
            @click="prevPage"
            :disabled="currentPage === 1"
            class="pagination-button"
          >
            {{ t('common.previous') }}
          </button>

          <div class="pagination-pages">
            <button
              v-for="page in searchHistory.meta.last_page"
              :key="page"
              @click="goToPage(page)"
              :class="['pagination-page', { active: page === currentPage }]"
            >
              {{ page }}
            </button>
          </div>

          <button
            @click="nextPage"
            :disabled="currentPage === searchHistory.meta.last_page"
            class="pagination-button"
          >
            {{ t('common.next') }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.history-container {
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

/* History Header */
.history-header {
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
  0%, 100% {
    transform: scale(1);
    opacity: 1;
  }
  50% {
    transform: scale(1.05);
    opacity: 0.9;
  }
}

.history-title {
  font-size: 3rem;
  font-weight: 800;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  margin-bottom: 1rem;
  letter-spacing: -0.02em;
}

.history-subtitle {
  font-size: 1.25rem;
  color: #6b7280;
  margin-bottom: 2rem;
}

/* History Grid */
.history-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 2rem;
  animation: fadeInUp 0.6s ease-out 0.2s both;
}

.history-card {
  background: white;
  border-radius: 1.5rem;
  padding: 1.5rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  cursor: pointer;
  transition: all 0.3s ease;
  animation: fadeInUp 0.6s ease-out both;
  border: 1px solid #e5e7eb;
}

.history-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 24px rgba(99, 102, 241, 0.15);
  border-color: #6366f1;
}

.card-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #e5e7eb;
}

.card-icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  background: linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(168, 85, 247, 0.1) 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #6366f1;
}

.card-info {
  flex: 1;
}

.card-title {
  font-size: 1.125rem;
  font-weight: 700;
  color: #111827;
  margin-bottom: 0.25rem;
  text-transform: capitalize;
}

.card-subtitle {
  font-size: 0.875rem;
  color: #6b7280;
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.card-body {
  margin-bottom: 1.5rem;
}

.card-detail {
  display: flex;
  justify-content: space-between;
  padding: 0.75rem 0;
  border-bottom: 1px solid #f3f4f6;
}

.card-detail:last-child {
  border-bottom: none;
}

.detail-label {
  font-size: 0.875rem;
  font-weight: 600;
  color: #6366f1;
}

.detail-value {
  font-size: 0.875rem;
  color: #374151;
  font-weight: 500;
  text-transform: capitalize;
}

.card-footer {
  margin-top: auto;
}

.view-button {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  font-weight: 600;
  border-radius: 0.75rem;
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;
}

.view-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 12px rgba(99, 102, 241, 0.4);
}

/* Pagination */
.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  margin-top: 3rem;
}

.pagination-button {
  padding: 0.75rem 1.5rem;
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  font-weight: 600;
  color: #374151;
  cursor: pointer;
  transition: all 0.2s ease;
}

.pagination-button:hover:not(:disabled) {
  background: #f9fafb;
  border-color: #6366f1;
  color: #6366f1;
}

.pagination-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.pagination-pages {
  display: flex;
  gap: 0.5rem;
}

.pagination-page {
  width: 40px;
  height: 40px;
  border-radius: 0.5rem;
  border: 1px solid #e5e7eb;
  background: white;
  cursor: pointer;
  transition: all 0.2s ease;
  font-weight: 600;
  color: #374151;
}

.pagination-page:hover {
  background: #f9fafb;
  border-color: #6366f1;
  color: #6366f1;
}

.pagination-page.active {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-color: transparent;
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
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-10px); }
  75% { transform: translateX(10px); }
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
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  box-shadow: 0 4px 6px rgba(99, 102, 241, 0.3);
}

.back-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 12px rgba(99, 102, 241, 0.4);
}

/* Animations */
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

/* Dark Mode */
@media (prefers-color-scheme: dark) {
  .history-card {
    background: #1f2937;
    border-color: #374151;
  }

  .history-card:hover {
    border-color: #6366f1;
  }

  .card-header {
    border-color: #374151;
  }

  .card-title {
    color: #f3f4f6;
  }

  .card-subtitle {
    color: #d1d5db;
  }

  .card-detail {
    border-color: #374151;
  }

  .detail-value {
    color: #d1d5db;
  }

  .history-subtitle {
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

  .pagination-button,
  .pagination-page {
    background: #1f2937;
    border-color: #374151;
    color: #d1d5db;
  }

  .pagination-button:hover:not(:disabled),
  .pagination-page:hover {
    background: #374151;
  }
}

/* Responsive */
@media (max-width: 768px) {
  .history-title {
    font-size: 2rem;
  }

  .history-subtitle {
    font-size: 1rem;
  }

  .history-grid {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }

  .pagination-pages {
    max-width: 200px;
    overflow-x: auto;
  }
}
</style>
