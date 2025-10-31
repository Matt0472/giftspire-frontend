# ThemeToggle Component

A toggle button component for switching between light and dark themes.

## Features

- ✅ Smooth theme transitions
- ✅ Icon switching (Sun/Moon)
- ✅ Persistent theme preference (localStorage)
- ✅ System preference detection
- ✅ Accessible button with aria-label
- ✅ Hover effects
- ✅ Integration with theme store

## Basic Usage

```vue
<template>
  <ThemeToggle />
</template>

<script setup lang="ts">
import ThemeToggle from '@/components/ui/ThemeToggle.vue'
</script>
```

## How It Works

The component uses:
1. **Theme Store** (`stores/theme.ts`) - Manages theme state
2. **Theme Composable** (`composables/useTheme.ts`) - Provides theme utilities
3. **localStorage** - Persists user preference
4. **Tailwind Dark Mode** - Applies dark mode classes

### Theme Store

The theme is managed globally through Pinia store:

```typescript
// src/stores/theme.ts
export const useThemeStore = defineStore('theme', () => {
  const theme = ref<'light' | 'dark'>('light')

  const setTheme = (newTheme: 'light' | 'dark') => {
    theme.value = newTheme
    localStorage.setItem('theme', newTheme)
    applyTheme(newTheme)
  }

  const toggleTheme = () => {
    setTheme(theme.value === 'light' ? 'dark' : 'light')
  }

  return { theme, setTheme, toggleTheme, initTheme }
})
```

### Theme Composable

```typescript
// src/composables/useTheme.ts
export function useTheme() {
  const themeStore = useThemeStore()

  const isDark = computed(() => themeStore.theme === 'dark')

  const toggleTheme = () => {
    themeStore.toggleTheme()
  }

  return {
    isDark,
    theme: themeStore.theme,
    toggleTheme,
    setTheme: themeStore.setTheme
  }
}
```

## Usage in Components

### Simple Toggle

```vue
<template>
  <ThemeToggle />
</template>
```

### In Header

```vue
<template>
  <header class="flex items-center justify-between p-4">
    <h1>My App</h1>
    <div class="flex items-center gap-4">
      <ThemeToggle />
      <!-- Other header items -->
    </div>
  </header>
</template>
```

### Custom Implementation

If you need a custom theme toggle:

```vue
<template>
  <button @click="toggleTheme" class="p-2 rounded-lg">
    {{ isDark ? '🌙' : '☀️' }}
  </button>
</template>

<script setup lang="ts">
import { useTheme } from '@/composables/useTheme'

const { isDark, toggleTheme } = useTheme()
</script>
```

## Programmatic Theme Control

### Get Current Theme

```vue
<script setup lang="ts">
import { useTheme } from '@/composables/useTheme'

const { theme, isDark } = useTheme()

console.log(theme) // 'light' or 'dark'
console.log(isDark) // true or false
</script>
```

### Set Theme Directly

```vue
<script setup lang="ts">
import { useTheme } from '@/composables/useTheme'

const { setTheme } = useTheme()

// Force light theme
setTheme('light')

// Force dark theme
setTheme('dark')
</script>
```

### Toggle Theme

```vue
<script setup lang="ts">
import { useTheme } from '@/composables/useTheme'

const { toggleTheme } = useTheme()

// Toggle between light and dark
toggleTheme()
</script>
```

## System Preference Detection

The theme system automatically detects the user's system preference on first load:

```typescript
// From theme store
const initTheme = () => {
  const savedTheme = localStorage.getItem('theme')

  if (savedTheme === 'light' || savedTheme === 'dark') {
    setTheme(savedTheme)
  } else {
    // Detect system preference
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    setTheme(prefersDark ? 'dark' : 'light')
  }
}
```

## Icons

The component uses icons from `lucide-vue-next`:
- **Sun** icon - Shown in dark mode (click to go light)
- **Moon** icon - Shown in light mode (click to go dark)

## Styling

```vue
<!-- From ThemeToggle.vue -->
<button
  class="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
>
  <Sun v-if="isDark" class="w-6 h-6" />
  <Moon v-else class="w-6 h-6" />
</button>
```

## Accessibility

- **aria-label**: Descriptive label indicating the action
- **Keyboard accessible**: Works with Enter and Space keys
- **Visual feedback**: Hover states for better UX
- **Icon clarity**: Clear sun/moon icons indicate current theme

```vue
<button
  :aria-label="`Switch to ${isDark ? 'light' : 'dark'} mode`"
>
```

## Dark Mode Classes

Use Tailwind's `dark:` prefix for dark mode styles:

```vue
<template>
  <div class="bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
    <h1 class="text-blue-600 dark:text-blue-400">Title</h1>
    <p class="text-gray-600 dark:text-gray-300">Description</p>
  </div>
</template>
```

## Examples

### Custom Theme Selector

```vue
<template>
  <div class="flex gap-2">
    <button
      @click="setTheme('light')"
      :class="{ 'ring-2 ring-blue-500': !isDark }"
      class="p-2 rounded"
    >
      ☀️ Light
    </button>
    <button
      @click="setTheme('dark')"
      :class="{ 'ring-2 ring-blue-500': isDark }"
      class="p-2 rounded"
    >
      🌙 Dark
    </button>
  </div>
</template>

<script setup lang="ts">
import { useTheme } from '@/composables/useTheme'

const { isDark, setTheme } = useTheme()
</script>
```

### Theme-Aware Component

```vue
<template>
  <div class="card" :class="cardClasses">
    <h2>{{ title }}</h2>
    <p>{{ description }}</p>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useTheme } from '@/composables/useTheme'

const { isDark } = useTheme()

const cardClasses = computed(() => ({
  'bg-white text-gray-900': !isDark,
  'bg-gray-800 text-white': isDark
}))
</script>
```

### Settings Page Integration

```vue
<template>
  <div class="settings">
    <h2>Appearance</h2>

    <div class="setting-item">
      <label>Theme</label>
      <div class="flex items-center gap-2">
        <span>{{ isDark ? 'Dark' : 'Light' }}</span>
        <ThemeToggle />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useTheme } from '@/composables/useTheme'
import ThemeToggle from '@/components/ui/ThemeToggle.vue'

const { isDark } = useTheme()
</script>
```

## Persistence

Theme preference is automatically saved to `localStorage`:

```typescript
// Key: 'theme'
// Values: 'light' | 'dark'

localStorage.setItem('theme', 'dark')
const theme = localStorage.getItem('theme')
```

## Best Practices

1. **Include once in layout**: Add ThemeToggle to your main layout/header
2. **Use dark: prefix**: Apply dark mode styles with Tailwind's `dark:` prefix
3. **Test both modes**: Always test your UI in both light and dark modes
4. **Consistent colors**: Use semantic color names that work in both modes
5. **Accessibility**: Ensure sufficient contrast in both themes

## Common Color Patterns

```css
/* Text colors */
text-gray-900 dark:text-white
text-gray-600 dark:text-gray-300

/* Background colors */
bg-white dark:bg-gray-900
bg-gray-50 dark:bg-gray-800
bg-gray-100 dark:bg-gray-700

/* Border colors */
border-gray-300 dark:border-gray-600
border-gray-200 dark:border-gray-700

/* Hover states */
hover:bg-gray-100 dark:hover:bg-gray-800
hover:text-gray-900 dark:hover:text-white
```
