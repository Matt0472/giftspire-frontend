import { computed } from 'vue'
import { useThemeStore } from '@/stores/theme'

export function useTheme() {
  const themeStore = useThemeStore()

  const isDark = computed(() => themeStore.theme === 'dark')
  const isLight = computed(() => themeStore.theme === 'light')

  return {
    theme: computed(() => themeStore.theme),
    isDark,
    isLight,
    toggleTheme: themeStore.toggleTheme,
    setTheme: themeStore.setTheme,
  }
}
