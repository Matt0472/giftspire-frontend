/**
 * WebSocket Configuration for Laravel Reverb
 *
 * Security Notes:
 * - Uses private channels with Sanctum authentication
 * - Authorization happens via /broadcasting/auth endpoint
 * - TLS should be enabled in production (wss://)
 */

export const websocketConfig = {
  broadcaster: 'pusher', // Reverb uses Pusher protocol
  key: import.meta.env.VITE_REVERB_APP_KEY,
  cluster: 'mt1', // Required by Pusher.js but not used by Reverb
  wsHost: import.meta.env.VITE_REVERB_HOST,
  wsPort: import.meta.env.VITE_REVERB_PORT ?? 9000,
  wssPort: import.meta.env.VITE_REVERB_PORT ?? 9000,
  forceTLS: import.meta.env.VITE_REVERB_SCHEME === 'https',
  enabledTransports: ['ws', 'wss'],

  // Authentication configuration
  authEndpoint: `${import.meta.env.VITE_API_BASE_URL}/broadcasting/auth`,

  // Authorization headers - will be set dynamically
  auth: {
    headers: {}
  },

  // Connection options
  disableStats: true,
  encrypted: import.meta.env.VITE_REVERB_SCHEME === 'https',

  // Reconnection settings
  enableLogging: import.meta.env.DEV,
}

// Debug log in development
if (import.meta.env.DEV) {
  console.log('[WebSocket Config] Loaded configuration:', {
    broadcaster: websocketConfig.broadcaster,
    key: websocketConfig.key,
    wsHost: websocketConfig.wsHost,
    wsPort: websocketConfig.wsPort,
    authEndpoint: websocketConfig.authEndpoint,
    forceTLS: websocketConfig.forceTLS,
  })
}

export default websocketConfig
