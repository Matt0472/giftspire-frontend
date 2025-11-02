import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

/**
 * Notification interface matching backend SearchCompletedNotification event
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
 * Security: Notifications are only received via authenticated WebSocket channels
 * Each user can only receive notifications on their private channel
 */
export const useNotificationStore = defineStore('notification', () => {
  const notifications = ref<Notification[]>([])
  const maxNotifications = 50 // Limit stored notifications to prevent memory issues

  /**
   * Add a new notification (typically from WebSocket event)
   */
  const addNotification = (notification: Omit<Notification, 'id' | 'read'>) => {
    const newNotification: Notification = {
      id: `notification-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      read: false,
      ...notification,
    }

    // Add to the beginning of the array (newest first)
    notifications.value.unshift(newNotification)

    // Limit the number of stored notifications
    if (notifications.value.length > maxNotifications) {
      notifications.value = notifications.value.slice(0, maxNotifications)
    }

    return newNotification.id
  }

  /**
   * Mark a notification as read
   */
  const markAsRead = (id: string | number) => {
    const notification = notifications.value.find((n) => n.id === id)
    if (notification) {
      notification.read = true
    }
  }

  /**
   * Mark all notifications as read
   */
  const markAllAsRead = () => {
    notifications.value.forEach((n) => (n.read = true))
  }

  /**
   * Remove a specific notification
   */
  const removeNotification = (id: string | number) => {
    const index = notifications.value.findIndex((n) => n.id === id)
    if (index > -1) {
      notifications.value.splice(index, 1)
    }
  }

  /**
   * Clear all notifications
   */
  const clearAll = () => {
    notifications.value = []
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
    addNotification,
    markAsRead,
    markAllAsRead,
    removeNotification,
    clearAll,
    handleWebSocketNotification,
  }
})
