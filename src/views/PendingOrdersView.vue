<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { giftSearchAPI } from '@/api/giftSearch'
import type { PendingOrderItem, PendingOrdersResponse } from '@/types/giftSearch'
import BaseSkeleton from '@/components/ui/BaseSkeleton.vue'
import AppBreadcrumbs from '@/components/ui/AppBreadcrumbs.vue'
import { AlertCircle, Clock, Loader, Trash2 } from 'lucide-vue-next'

const { t } = useI18n()

const isLoading = ref(true)
const error = ref<string | null>(null)
const pendingOrders = ref<PendingOrdersResponse | null>(null)
const currentPage = ref(1)
const deletingOrderId = ref<number | null>(null)

const breadcrumbItems = computed(() => [
  { label: t('common.dashboard'), to: { name: 'dashboard' } },
  { label: t('pendingOrders.title'), to: undefined },
])

const loadPendingOrders = async (page: number = 1) => {
  try {
    isLoading.value = true
    error.value = null

    pendingOrders.value = await giftSearchAPI.getPendingOrders(page)
    currentPage.value = page
  } catch (err: unknown) {
    console.error('Failed to load pending orders:', err)
    error.value =
      (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
      'Failed to load pending orders'
  } finally {
    isLoading.value = false
  }
}

const deletePendingOrder = async (orderId: number) => {
  if (!confirm(t('pendingOrders.confirmDelete'))) {
    return
  }

  try {
    deletingOrderId.value = orderId
    await giftSearchAPI.deletePendingOrder(orderId)

    // If we're on a page that will be empty after deletion, go to previous page
    if (pendingOrders.value && pendingOrders.value.data.length === 1 && currentPage.value > 1) {
      await loadPendingOrders(currentPage.value - 1)
    } else {
      // Reload the current page
      await loadPendingOrders(currentPage.value)
    }
  } catch (err: unknown) {
    console.error('Failed to delete pending order:', err)
    error.value =
      (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
      'Failed to delete pending order'
  } finally {
    deletingOrderId.value = null
  }
}

const getStatusInfo = (order: PendingOrderItem) => {
  if (order.failed_at) {
    return {
      text: t('pendingOrders.status.failed'),
      icon: AlertCircle,
      class: 'status-failed',
    }
  }
  if (order.started_at) {
    return {
      text: t('pendingOrders.status.processing'),
      icon: Loader,
      class: 'status-processing',
    }
  }
  return {
    text: t('pendingOrders.status.pending'),
    icon: Clock,
    class: 'status-pending',
  }
}

const formatDate = (dateString: string | null) => {
  if (!dateString) return '-'
  const date = new Date(dateString)
  return new Intl.DateTimeFormat(t('common.locale'), {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date)
}

const nextPage = () => {
  if (pendingOrders.value && currentPage.value < pendingOrders.value.meta.last_page) {
    loadPendingOrders(currentPage.value + 1)
  }
}

const prevPage = () => {
  if (currentPage.value > 1) {
    loadPendingOrders(currentPage.value - 1)
  }
}

const goToPage = (page: number) => {
  loadPendingOrders(page)
}

onMounted(() => {
  loadPendingOrders()
})
</script>

<template>
  <div class="pending-orders-container">
    <!-- Breadcrumbs -->
    <AppBreadcrumbs :items="breadcrumbItems" />

    <!-- Loading State -->
    <div v-if="isLoading" class="loading-state">
      <div class="loading-header">
        <BaseSkeleton shape="rect" inner-class="h-12 w-3/4 mx-auto" />
        <BaseSkeleton shape="rect" inner-class="h-6 w-1/2 mx-auto mt-4" />
      </div>

      <div class="orders-grid">
        <BaseSkeleton v-for="i in 6" :key="i" shape="rect" inner-class="h-64 w-full rounded-2xl" />
      </div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="error-state">
      <div class="error-icon">❌</div>
      <h2 class="error-title">{{ t('pendingOrders.error.title') }}</h2>
      <p class="error-description">{{ error }}</p>
      <router-link to="/dashboard" class="back-button">
        {{ t('pendingOrders.error.backToDashboard') }}
      </router-link>
    </div>

    <!-- Pending Orders List -->
    <div v-else-if="pendingOrders">
      <!-- Header -->
      <div class="orders-header">
        <div class="header-icon">
          <Clock class="w-12 h-12" />
        </div>
        <h1 class="orders-title">{{ t('pendingOrders.title') }}</h1>
        <p class="orders-subtitle">
          {{ t('pendingOrders.subtitle', { count: pendingOrders.meta.total }) }}
        </p>
      </div>

      <!-- Empty State -->
      <div v-if="pendingOrders.data.length === 0" class="empty-state">
        <div class="empty-icon">📝</div>
        <h2 class="empty-title">{{ t('pendingOrders.empty.title') }}</h2>
        <p class="empty-description">{{ t('pendingOrders.empty.description') }}</p>
        <router-link to="/dashboard" class="back-button">
          {{ t('pendingOrders.empty.startSearching') }}
        </router-link>
      </div>

      <!-- Pending Orders Grid -->
      <div v-else>
        <div class="orders-grid">
          <div
            v-for="(order, index) in pendingOrders.data"
            :key="order.id"
            class="order-card"
            :style="{ animationDelay: `${index * 100}ms` }"
          >
            <div class="card-header">
              <div class="card-icon">
                <component :is="getStatusInfo(order).icon" class="w-6 h-6" />
              </div>
              <div class="card-info">
                <h3 class="card-title">
                  {{ t('pendingOrders.searchFor') }} {{ order.options.relation }}
                </h3>
                <div :class="['card-status', getStatusInfo(order).class]">
                  {{ getStatusInfo(order).text }}
                </div>
              </div>
            </div>

            <div class="card-body">
              <div class="card-detail">
                <span class="detail-label">{{ t('pendingOrders.occasion') }}:</span>
                <span class="detail-value">{{ order.options.occasion }}</span>
              </div>
              <div class="card-detail">
                <span class="detail-label">{{ t('pendingOrders.budget') }}:</span>
                <span class="detail-value">
                  €{{ order.options.min_budget }} - €{{ order.options.max_budget }}
                </span>
              </div>
              <div class="card-detail">
                <span class="detail-label">{{ t('pendingOrders.interests') }}:</span>
                <span class="detail-value">{{ order.options.interests.join(', ') }}</span>
              </div>
              <div class="card-detail">
                <span class="detail-label">{{ t('pendingOrders.createdAt') }}:</span>
                <span class="detail-value">{{ formatDate(order.created_at) }}</span>
              </div>

              <!-- Error details if failed -->
              <div v-if="order.failed_at" class="error-details">
                <div class="error-label">{{ t('pendingOrders.errorDetails') }}:</div>
                <div class="error-message">
                  {{ order.error_details || t('pendingOrders.unknownError') }}
                </div>
              </div>
            </div>

            <div class="card-footer">
              <button
                @click="deletePendingOrder(order.id)"
                :disabled="deletingOrderId === order.id"
                class="delete-button"
              >
                <Loader v-if="deletingOrderId === order.id" class="w-4 h-4 animate-spin" />
                <Trash2 v-else class="w-4 h-4" />
                {{ t('pendingOrders.delete') }}
              </button>
            </div>
          </div>
        </div>

        <!-- Pagination -->
        <div v-if="pendingOrders.meta.last_page > 1" class="pagination">
          <button @click="prevPage" :disabled="currentPage === 1" class="pagination-button">
            {{ t('common.previous') }}
          </button>

          <div class="pagination-pages">
            <button
              v-for="page in pendingOrders.meta.last_page"
              :key="page"
              @click="goToPage(page)"
              :class="['pagination-page', { active: page === currentPage }]"
            >
              {{ page }}
            </button>
          </div>

          <button
            @click="nextPage"
            :disabled="currentPage === pendingOrders.meta.last_page"
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
.pending-orders-container {
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

/* Orders Header */
.orders-header {
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
  background: linear-gradient(135deg, rgba(249, 115, 22, 0.1) 0%, rgba(234, 179, 8, 0.1) 100%);
  border-radius: 50%;
  margin-bottom: 1.5rem;
  color: #f97316;
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

.orders-title {
  font-size: 3rem;
  font-weight: 800;
  background: linear-gradient(135deg, #f97316 0%, #eab308 100%);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  margin-bottom: 1rem;
  letter-spacing: -0.02em;
}

.orders-subtitle {
  font-size: 1.25rem;
  color: #6b7280;
  margin-bottom: 2rem;
}

/* Orders Grid */
.orders-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 2rem;
  animation: fadeInUp 0.6s ease-out 0.2s both;
}

.order-card {
  background: white;
  border-radius: 1.5rem;
  padding: 1.5rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
  animation: fadeInUp 0.6s ease-out both;
  border: 1px solid #e5e7eb;
}

.order-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 24px rgba(249, 115, 22, 0.15);
  border-color: #f97316;
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
  background: linear-gradient(135deg, rgba(249, 115, 22, 0.1) 0%, rgba(234, 179, 8, 0.1) 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #f97316;
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

.card-status {
  font-size: 0.875rem;
  font-weight: 600;
  padding: 0.25rem 0.75rem;
  border-radius: 0.5rem;
  display: inline-block;
}

.status-pending {
  background: rgba(59, 130, 246, 0.1);
  color: #3b82f6;
}

.status-processing {
  background: rgba(234, 179, 8, 0.1);
  color: #eab308;
}

.status-failed {
  background: rgba(239, 68, 68, 0.1);
  color: #ef4444;
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
  color: #f97316;
}

.detail-value {
  font-size: 0.875rem;
  color: #374151;
  font-weight: 500;
  text-transform: capitalize;
}

.error-details {
  margin-top: 1rem;
  padding: 1rem;
  background: rgba(239, 68, 68, 0.05);
  border-radius: 0.75rem;
  border-left: 4px solid #ef4444;
}

.error-label {
  font-size: 0.875rem;
  font-weight: 700;
  color: #ef4444;
  margin-bottom: 0.5rem;
}

.error-message {
  font-size: 0.875rem;
  color: #dc2626;
}

.card-footer {
  margin-top: auto;
}

.delete-button {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
  color: white;
  font-weight: 600;
  border-radius: 0.75rem;
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;
}

.delete-button:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 12px rgba(239, 68, 68, 0.4);
}

.delete-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
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
  border-color: #f97316;
  color: #f97316;
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
  border-color: #f97316;
  color: #f97316;
}

.pagination-page.active {
  background: linear-gradient(135deg, #f97316 0%, #eab308 100%);
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
  background: linear-gradient(135deg, #f97316 0%, #eab308 100%);
  color: white;
  font-weight: 600;
  border-radius: 0.75rem;
  text-decoration: none;
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;
  box-shadow: 0 4px 6px rgba(249, 115, 22, 0.3);
}

.back-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 12px rgba(249, 115, 22, 0.4);
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
  .order-card {
    background: #1f2937;
    border-color: #374151;
  }

  .order-card:hover {
    border-color: #f97316;
  }

  .card-header {
    border-color: #374151;
  }

  .card-title {
    color: #f3f4f6;
  }

  .card-detail {
    border-color: #374151;
  }

  .detail-value {
    color: #d1d5db;
  }

  .orders-subtitle {
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
  .orders-title {
    font-size: 2rem;
  }

  .orders-subtitle {
    font-size: 1rem;
  }

  .orders-grid {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }

  .pagination-pages {
    max-width: 200px;
    overflow-x: auto;
  }
}
</style>
