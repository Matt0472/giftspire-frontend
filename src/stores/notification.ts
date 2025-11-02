import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import axios from 'axios'

/**
 * Notification interface matching backend Notification model
 */
export interface Notification {
  id: string | number
  type: 'success' | 'info' | 'warning' | 'error'
  title: string
  message: string
  icon?: string
  read: boolean
  timestamp: string
  orderId?: string | number
  searchId?: string | number
}

/**
 * Notification Store
 *
 * Security: Notifications are stored in the backend database and protected by Sanctum authentication
 * Each user can only access their own notifications via API
 * Persistence: Notifications are stored in the database, surviving browser cache clearing and available across devices
 */
export const useNotificationStore = defineStore('notification', () => {
  const notifications = ref<Notification[]>([])
  const loading = ref(false)

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

  /**
   * Get authorization headers with Sanctum token
   */
  const getAuthHeaders = () => {
    const token = localStorage.getItem('auth_token')
    return {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    }
  }

  /**
   * Fetch notifications from backend API
   */
  const fetchNotifications = async () => {
    try {
      loading.value = true
      const response = await axios.get(`${API_BASE_URL}/notifications`, {
        headers: getAuthHeaders(),
      })

      notifications.value = response.data.notifications
      console.log(`[Notification Store] Loaded ${response.data.notifications.length} notifications from backend`)
    } catch (error) {
      console.error('[Notification Store] Error fetching notifications from backend:', error)
    } finally {
      loading.value = false
    }
  }

  /**
   * Add a new notification (typically from WebSocket event)
   * This adds optimistically to the local state, the backend already saved it
   */
  const addNotification = (notification: Omit<Notification, 'id' | 'read'>) => {
    const newNotification: Notification = {
      id: `notification-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      read: false,
      ...notification,
    }

    // Add to the beginning of the array (newest first)
    notifications.value.unshift(newNotification)

    return newNotification.id
  }

  /**
   * Mark a notification as read via API
   */
  const markAsRead = async (id: string | number) => {
    try {
      // Optimistic update
      const notification = notifications.value.find((n) => n.id === id)
      if (notification) {
        notification.read = true
      }

      // Sync with backend
      await axios.post(
        `${API_BASE_URL}/notifications/${id}/read`,
        {},
        {
          headers: getAuthHeaders(),
        }
      )
    } catch (error) {
      console.error('[Notification Store] Error marking notification as read:', error)
      // Revert optimistic update on error
      const notification = notifications.value.find((n) => n.id === id)
      if (notification) {
        notification.read = false
      }
    }
  }

  /**
   * Mark all notifications as read via API
   */
  const markAllAsRead = async () => {
    try {
      // Optimistic update
      notifications.value.forEach((n) => (n.read = true))

      // Sync with backend
      await axios.post(
        `${API_BASE_URL}/notifications/read-all`,
        {},
        {
          headers: getAuthHeaders(),
        }
      )
    } catch (error) {
      console.error('[Notification Store] Error marking all notifications as read:', error)
      // Refresh from backend on error
      await fetchNotifications()
    }
  }

  /**
   * Remove a specific notification via API
   */
  const removeNotification = async (id: string | number) => {
    try {
      // Optimistic update
      const index = notifications.value.findIndex((n) => n.id === id)
      if (index > -1) {
        notifications.value.splice(index, 1)
      }

      // Sync with backend
      await axios.delete(`${API_BASE_URL}/notifications/${id}`, {
        headers: getAuthHeaders(),
      })
    } catch (error) {
      console.error('[Notification Store] Error removing notification:', error)
      // Refresh from backend on error
      await fetchNotifications()
    }
  }

  /**
   * Clear all notifications via API
   */
  const clearAll = async () => {
    try {
      // Optimistic update
      notifications.value = []

      // Sync with backend
      await axios.delete(`${API_BASE_URL}/notifications`, {
        headers: getAuthHeaders(),
      })
    } catch (error) {
      console.error('[Notification Store] Error clearing all notifications:', error)
      // Refresh from backend on error
      await fetchNotifications()
    }
  }

  /**
   * Get unread notification count
   */
  const unreadCount = computed(() => {
    return notifications.value.filter((n) => !n.read).length
  })

  /**
   * Handle incoming WebSocket notification
   * Maps the backend event data to our Notification interface
   */
  const handleWebSocketNotification = (data: {
    order_id?: string | number
    title: string
    message: string
    icon?: string
    type: string
    timestamp: string
  }) => {
    addNotification({
      type: data.type as 'success' | 'info' | 'warning' | 'error',
      title: data.title,
      message: data.message,
      icon: data.icon,
      timestamp: data.timestamp,
      orderId: data.order_id,
      searchId: data.order_id,
    })
  }

  return {
    notifications,
    unreadCount,
    loading,
    fetchNotifications,
    addNotification,
    markAsRead,
    markAllAsRead,
    removeNotification,
    clearAll,
    handleWebSocketNotification,
  }
})
