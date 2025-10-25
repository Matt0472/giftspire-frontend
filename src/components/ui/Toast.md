# Toast Notification System

A comprehensive toast notification system with multiple variants and automatic management.

## Components

- **BaseToast**: Individual toast component
- **ToastContainer**: Container that displays all toasts
- **Toast Store**: Pinia store for managing toasts

## Features

- ✅ Four variants (info, warning, error, success)
- ✅ Auto-close with configurable duration
- ✅ Manual dismiss
- ✅ Title and message support
- ✅ Dark mode support
- ✅ Smooth animations
- ✅ Stacked display
- ✅ Global state management
- ✅ Accessibility support

## Setup

The `ToastContainer` should be included once in your app layout:

```vue
<!-- src/layouts/BaseLayout.vue -->
<template>
  <div>
    <!-- Your layout content -->
    <AppHeader />
    <main>
      <slot />
    </main>
    <AppFooter />

    <!-- Toast Container -->
    <ToastContainer />
  </div>
</template>

<script setup lang="ts">
import ToastContainer from '@/components/ui/ToastContainer.vue'
</script>
```

## Basic Usage

```vue
<script setup lang="ts">
import { useToastStore } from '@/stores/toast'

const toastStore = useToastStore()

const showToast = () => {
  toastStore.success('Operation completed successfully!')
}
</script>
```

## Toast Variants

### Success Toast

```typescript
toastStore.success('Profile updated successfully!')
toastStore.success('Data saved!', 'Success')
```

### Error Toast

```typescript
toastStore.error('Failed to save data')
toastStore.error('An error occurred', 'Error')
```

### Warning Toast

```typescript
toastStore.warning('Your session will expire soon')
toastStore.warning('Please review your input', 'Warning')
```

### Info Toast

```typescript
toastStore.info('New updates available')
toastStore.info('Check out our new features', 'Information')
```

## Advanced Usage

### Custom Options

```typescript
toastStore.success('Operation completed!', 'Success', {
  duration: 3000,        // 3 seconds
  dismissible: true,     // Show close button
  autoClose: true        // Auto close after duration
})
```

### Manual Toast Management

```typescript
// Add a custom toast
const toastId = toastStore.addToast({
  variant: 'info',
  message: 'Custom message',
  title: 'Custom Title',
  duration: 5000,
  dismissible: true,
  autoClose: false // Won't auto-close
})

// Remove specific toast
toastStore.removeToast(toastId)

// Clear all toasts
toastStore.clearAll()
```

## Store API

### Methods

| Method | Parameters | Description |
|--------|------------|-------------|
| `success(message, title?, options?)` | `string, string?, object?` | Show success toast |
| `error(message, title?, options?)` | `string, string?, object?` | Show error toast |
| `warning(message, title?, options?)` | `string, string?, object?` | Show warning toast |
| `info(message, title?, options?)` | `string, string?, object?` | Show info toast |
| `addToast(toast)` | `Toast` | Add custom toast |
| `removeToast(id)` | `string` | Remove specific toast |
| `clearAll()` | - | Clear all toasts |

### Toast Interface

```typescript
interface Toast {
  id: string                          // Auto-generated
  variant: 'info' | 'warning' | 'error' | 'success'
  title?: string                      // Optional title
  message: string                     // Required message
  dismissible?: boolean               // Show close button (default: true)
  autoClose?: boolean                 // Auto close (default: true)
  duration?: number                   // Duration in ms (default: 5000)
}
```

## BaseToast Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `variant` | `'info' \| 'warning' \| 'error' \| 'success'` | `'info'` | Toast style |
| `title` | `string` | - | Optional title |
| `message` | `string` | - | Message text (required) |
| `dismissible` | `boolean` | `true` | Show close button |
| `autoClose` | `boolean` | `true` | Auto close after duration |
| `duration` | `number` | `5000` | Duration in milliseconds |

## BaseToast Events

| Event | Description |
|-------|-------------|
| `close` | Emitted when toast is dismissed |

## Examples

### Form Submission

```vue
<script setup lang="ts">
import { useToastStore } from '@/stores/toast'

const toastStore = useToastStore()

const handleSubmit = async () => {
  try {
    await submitForm()
    toastStore.success('Form submitted successfully!')
  } catch (error) {
    toastStore.error('Failed to submit form. Please try again.', 'Error')
  }
}
</script>
```

### API Error Handling

```vue
<script setup lang="ts">
const handleApiCall = async () => {
  try {
    const response = await api.getData()
    toastStore.success('Data loaded successfully!')
    return response
  } catch (error: any) {
    if (error.response?.status === 401) {
      toastStore.error('You are not authorized', 'Authentication Error')
    } else if (error.response?.status === 404) {
      toastStore.warning('Resource not found', 'Not Found')
    } else {
      toastStore.error('An unexpected error occurred', 'Error')
    }
  }
}
</script>
```

### Multiple Toasts

```typescript
// Show multiple toasts at once
toastStore.info('Processing started...')

setTimeout(() => {
  toastStore.warning('Almost done...', 'Progress')
}, 2000)

setTimeout(() => {
  toastStore.success('Processing complete!', 'Success')
}, 4000)
```

### Long Duration Toast

```typescript
// Show a toast for 10 seconds
toastStore.info('Please read this carefully', 'Important Notice', {
  duration: 10000
})
```

### Persistent Toast

```typescript
// Toast that doesn't auto-close
toastStore.warning('Action required!', 'Warning', {
  autoClose: false
})
```

### Non-Dismissible Toast

```typescript
// Toast without close button
toastStore.info('Loading...', null, {
  dismissible: false,
  autoClose: false
})

// Later, remove it programmatically
const id = toastStore.info('Loading...', null, {
  dismissible: false,
  autoClose: false
})

// When done loading
toastStore.removeToast(id)
toastStore.success('Loaded!')
```

## Composable Usage

For convenience, you can create a composable:

```typescript
// src/composables/useToast.ts
import { useToastStore } from '@/stores/toast'

export function useToast() {
  const toastStore = useToastStore()

  return {
    success: toastStore.success,
    error: toastStore.error,
    warning: toastStore.warning,
    info: toastStore.info,
  }
}
```

Then use it in components:

```vue
<script setup lang="ts">
import { useToast } from '@/composables/useToast'

const toast = useToast()

const handleClick = () => {
  toast.success('Action completed!')
}
</script>
```

## Styling

Toasts appear in the top-right corner with:
- Smooth slide-in animation
- Automatic stacking
- Dark mode support
- Variant-specific colors:
  - **Info**: Blue
  - **Warning**: Yellow
  - **Error**: Red
  - **Success**: Green

## Accessibility

- Uses `aria-live="polite"` for screen readers
- `role="alert"` for important messages
- Close button with screen reader text
- Keyboard accessible
- Automatic dismissal announced to screen readers
