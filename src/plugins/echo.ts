import type { App, Plugin } from 'vue'
import Echo from 'laravel-echo'
import Pusher from 'pusher-js'
import websocketConfig from '@/config/websocket'
import { useNotificationStore } from '@/stores/notification'
import { useAuthStore } from '@/stores/auth'

// Make Pusher available globally for Laravel Echo
declare global {
  interface Window {
    Pusher: typeof Pusher
    Echo: Echo<'pusher'> | undefined
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
export function createEchoInstance(): Echo<'pusher'> | null {
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

  const echoInstance = new Echo<'pusher'>({
    broadcaster: websocketConfig.broadcaster,
    key: websocketConfig.key,
    cluster: websocketConfig.cluster,
    wsHost: websocketConfig.wsHost,
    wsPort: websocketConfig.wsPort,
    wssPort: websocketConfig.wssPort,
    forceTLS: websocketConfig.forceTLS,
    authEndpoint: websocketConfig.authEndpoint,
    disableStats: websocketConfig.disableStats,
    encrypted: websocketConfig.encrypted,
    enableLogging: websocketConfig.enableLogging,
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
export function setupNotificationListeners(echo: Echo<'pusher'> | null): void {
  if (!echo) return

  const authStore = useAuthStore()
  const notificationStore = useNotificationStore()

  const userId = authStore.user?.id

  if (!userId) {
    console.warn('[WebSocket] Cannot setup listeners: User ID not available')
    return
  }

  // Fetch existing notifications from backend on initialization
  notificationStore.fetchNotifications().catch((error) => {
    console.error('[WebSocket] Failed to fetch notifications:', error)
  })

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

      // Add notification to store (optimistically, already saved in backend)
      notificationStore.handleWebSocketNotification(data)
    })
    .error((error: Error) => {
      console.error('[WebSocket] Channel subscription error:', error)
    })

  console.log(`[WebSocket] Listening on private channel: App.Models.User.${userId}`)
}

/**
 * Disconnect from WebSocket
 */
export function disconnectEcho(): void {
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
export const echoPlugin: Plugin = {
  install: (app: App) => {
    console.log('[WebSocket] Echo plugin installing...')
    const authStore = useAuthStore()

    console.log('[WebSocket] Auth store state:', {
      isAuthenticated: authStore.isAuthenticated,
      hasUser: !!authStore.user,
      userId: authStore.user?.id,
    })

    // Initialize Echo when user is authenticated
    authStore.$subscribe((_mutation, state) => {
      const isAuthenticated = !!state.user && !!state.token

      console.log('[WebSocket] Auth state changed:', {
        isAuthenticated,
        hasEcho: !!window.Echo,
      })

      if (isAuthenticated && !window.Echo) {
        console.log('[WebSocket] User authenticated, initializing Echo...')
        const echo = createEchoInstance()
        if (echo) {
          window.Echo = echo
          setupNotificationListeners(echo)
          console.log('[WebSocket] Echo initialized and listeners setup')
        }
      } else if (!isAuthenticated && window.Echo) {
        console.log('[WebSocket] User logged out, disconnecting Echo')
        disconnectEcho()
        window.Echo = undefined
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
    app.provide('echo', window.Echo || null)
    console.log('[WebSocket] Echo plugin installed')
  },
}

export default echoPlugin
