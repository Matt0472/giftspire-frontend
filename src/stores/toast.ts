import { ref } from 'vue'
import { defineStore } from 'pinia'

export interface Toast {
  id: string
  variant: 'info' | 'warning' | 'error' | 'success'
  title?: string
  message: string
  dismissible?: boolean
  autoClose?: boolean
  duration?: number
}

export const useToastStore = defineStore('toast', () => {
  const toasts = ref<Toast[]>([])

  const addToast = (toast: Omit<Toast, 'id'>): string => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    toasts.value.push({
      id,
      dismissible: true,
      autoClose: true,
      duration: 5000,
      ...toast,
    })
    return id
  }

  const removeToast = (id: string) => {
    const index = toasts.value.findIndex((t) => t.id === id)
    if (index > -1) {
      toasts.value.splice(index, 1)
    }
  }

  const clearAll = () => {
    toasts.value = []
  }

  // Convenience methods
  const info = (message: string, title?: string, options?: Partial<Omit<Toast, 'id' | 'variant' | 'message' | 'title'>>) => {
    return addToast({ variant: 'info', message, title, ...options })
  }

  const warning = (message: string, title?: string, options?: Partial<Omit<Toast, 'id' | 'variant' | 'message' | 'title'>>) => {
    return addToast({ variant: 'warning', message, title, ...options })
  }

  const error = (message: string, title?: string, options?: Partial<Omit<Toast, 'id' | 'variant' | 'message' | 'title'>>) => {
    return addToast({ variant: 'error', message, title, ...options })
  }

  const success = (message: string, title?: string, options?: Partial<Omit<Toast, 'id' | 'variant' | 'message' | 'title'>>) => {
    return addToast({ variant: 'success', message, title, ...options })
  }

  return {
    toasts,
    addToast,
    removeToast,
    clearAll,
    info,
    warning,
    error,
    success,
  }
})
