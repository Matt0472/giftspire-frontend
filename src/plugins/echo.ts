import type { App } from 'vue'
import Echo from 'laravel-echo'
import Pusher from 'pusher-js'
import websocketConfig from '@/config/websocket'
import { useNotificationStore } from '@/stores/notification'
import { useAuthStore } from '@/stores/auth'
import { useToastStore } from '@/stores/toast'

// Make Pusher available globally for Laravel Echo
declare global {
  interface Window {
    Pusher: typeof Pusher
    Echo: Echo
  }
}

window.Pusher = Pusher

/**
 * Initialize Laravel Echo with Reverb WebSocket Server
 *
 * Security Features:
 * - Uses Sanctum token for authentication
 * - Connects to private user channels only
 * - Authorization verified via /broadcasting/auth endpoint
 * - Token sent in Authorization header
 */
export function createEchoInstance(): Echo | null {
  const authStore = useAuthStore()
  const token = localStorage.getItem('auth_token')

  console.log('[WebSocket] createEchoInstance called', {
    isAuthenticated: authStore.isAuthenticated,
    hasToken: !!token,
    userId: authStore.user?.id,
  })

  // Only initialize if user is authenticated
  if (!authStore.isAuthenticated || !token) {
    console.log('[WebSocket] Not authenticated, skipping Echo initialization')
    return null
  }

  console.log('[WebSocket] Creating Echo instance with config:', {
    broadcaster: websocketConfig.broadcaster,
    wsHost: websocketConfig.wsHost,
    wsPort: websocketConfig.wsPort,
    authEndpoint: websocketConfig.authEndpoint,
  })

  const echoInstance = new Echo({
    ...websocketConfig,
    auth: {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
      },
    },
  })

  console.log('[WebSocket] Echo instance created successfully')
  return echoInstance
}

/**
 * Setup WebSocket notification listeners
 */
export function setupNotificationListeners(echo: Echo | null) {
  if (!echo) return

  const authStore = useAuthStore()
  const notificationStore = useNotificationStore()
  const toastStore = useToastStore()

  const userId = authStore.user?.id

  if (!userId) {
    console.warn('[WebSocket] Cannot setup listeners: User ID not available')
    return
  }

  // Listen to the private user channel for search completed notifications
  // Channel name format: App.Models.User.{userId}
  // Event name: search.completed (defined in SearchCompletedNotification::broadcastAs)
  echo
    .private(`App.Models.User.${userId}`)
    .listen('.search.completed', (data: {
      order_id: string | number
      title: string
      message: string
      icon?: string
      type: string
      timestamp: string
    }) => {
      console.log('[WebSocket] Search completed notification received:', data)

      // Add notification to store
      notificationStore.handleWebSocketNotification(data)

      // Show toast notification
      toastStore.success(data.message, data.title, {
        duration: 7000,
      })
    })
    .error((error: Error) => {
      console.error('[WebSocket] Channel subscription error:', error)
    })

  console.log(`[WebSocket] Listening on private channel: App.Models.User.${userId}`)
}

/**
 * Disconnect from WebSocket
 */
export function disconnectEcho() {
  if (window.Echo) {
    window.Echo.disconnect()
    console.log('[WebSocket] Disconnected')
  }
}

/**
 * Echo Plugin for Vue
 *
 * Usage in main.ts:
 * import { echoPlugin } from './plugins/echo'
 * app.use(echoPlugin)
 */
export const echoPlugin = {
  install: (app: App) => {
    console.log('[WebSocket] Echo plugin installing...')
    const authStore = useAuthStore()

    console.log('[WebSocket] Auth store state:', {
      isAuthenticated: authStore.isAuthenticated,
      hasUser: !!authStore.user,
      userId: authStore.user?.id,
    })

    // Initialize Echo when user is authenticated
    authStore.$subscribe((mutation, state) => {
      console.log('[WebSocket] Auth state changed:', {
        isAuthenticated: state.isAuthenticated,
        hasEcho: !!window.Echo,
      })

      if (state.isAuthenticated && !window.Echo) {
        console.log('[WebSocket] User authenticated, initializing Echo...')
        const echo = createEchoInstance()
        if (echo) {
          window.Echo = echo
          setupNotificationListeners(echo)
          console.log('[WebSocket] Echo initialized and listeners setup')
        }
      } else if (!state.isAuthenticated && window.Echo) {
        console.log('[WebSocket] User logged out, disconnecting Echo')
        disconnectEcho()
      }
    })

    // Initialize immediately if already authenticated
    if (authStore.isAuthenticated) {
      console.log('[WebSocket] User already authenticated, initializing immediately')
      const echo = createEchoInstance()
      if (echo) {
        window.Echo = echo
        setupNotificationListeners(echo)
        console.log('[WebSocket] Echo initialized on app start')
      }
    } else {
      console.log('[WebSocket] User not authenticated yet, waiting for login...')
    }

    // Provide Echo instance to components (optional)
    app.provide('echo', window.Echo)
    console.log('[WebSocket] Echo plugin installed')
  },
}

export default echoPlugin
