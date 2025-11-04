import { ref } from 'vue'
import { giftSearchAPI } from '@/api/giftSearch'
import { useAuthStore } from '@/stores/auth'

const pendingOrdersCount = ref(0)
let refreshInterval: number | null = null

/**
 * Composable to manage pending orders count across components
 * Provides a shared reactive count and refresh functionality
 */
export function usePendingOrdersCount() {
  const authStore = useAuthStore()

  /**
   * Fetch the current pending orders count from the API
   */
  const fetchPendingOrdersCount = async () => {
    if (!authStore.isAuthenticated) {
      pendingOrdersCount.value = 0
      return
    }

    try {
      const response = await giftSearchAPI.getPendingOrders(1, 1)
      pendingOrdersCount.value = response.meta.total
    } catch (error) {
      console.error('[usePendingOrdersCount] Failed to fetch pending orders count:', error)
      pendingOrdersCount.value = 0
    }
  }

  /**
   * Start auto-refresh interval (30 seconds)
   */
  const startAutoRefresh = () => {
    if (refreshInterval !== null) return // Already running

    fetchPendingOrdersCount() // Initial fetch
    refreshInterval = window.setInterval(fetchPendingOrdersCount, 30000)
  }

  /**
   * Stop auto-refresh interval
   */
  const stopAutoRefresh = () => {
    if (refreshInterval !== null) {
      clearInterval(refreshInterval)
      refreshInterval = null
    }
  }

  return {
    pendingOrdersCount,
    fetchPendingOrdersCount,
    startAutoRefresh,
    stopAutoRefresh,
  }
}
