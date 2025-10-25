# LanguageSwitcher Component

A dropdown component for switching between languages (English and Italian).

## Features

- ✅ Dropdown language selector
- ✅ Flag icons for visual recognition
- ✅ Current language indicator (checkmark)
- ✅ Persistent language preference (localStorage)
- ✅ Integration with vue-i18n
- ✅ Click outside to close
- ✅ Dark mode support
- ✅ Smooth animations
- ✅ Accessible with aria-labels

## Basic Usage

```vue
<template>
  <LanguageSwitcher />
</template>

<script setup lang="ts">
import LanguageSwitcher from '@/components/ui/LanguageSwitcher.vue'
</script>
```

## Available Languages

Currently supports two languages:
- **English (EN)** 🇬🇧
- **Italian (IT)** 🇮🇹

## How It Works

The component integrates with vue-i18n for internationalization:

### i18n Configuration

```typescript
// src/i18n/index.ts
import { createI18n } from 'vue-i18n'
import en from './locales/en'
import it from './locales/it'

const savedLocale = localStorage.getItem('locale') || 'en'

const i18n = createI18n({
  legacy: false,
  locale: savedLocale,
  fallbackLocale: 'en',
  messages: { en, it }
})
```

### Translation Files

```typescript
// src/i18n/locales/en.ts
export default {
  common: {
    appName: 'GiftSpire',
    login: 'Login',
    // ...
  },
  home: {
    heroTitle: 'Find the Perfect Gift',
    // ...
  }
}
```

```typescript
// src/i18n/locales/it.ts
export default {
  common: {
    appName: 'GiftSpire',
    login: 'Accedi',
    // ...
  },
  home: {
    heroTitle: 'Trova il Regalo Perfetto',
    // ...
  }
}
```

## Using Translations

### In Templates

```vue
<template>
  <h1>{{ t('home.heroTitle') }}</h1>
  <p>{{ t('home.subtitle') }}</p>
  <button>{{ t('common.login') }}</button>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
</script>
```

### With Parameters

```vue
<template>
  <p>{{ t('footer.copyright', [currentYear]) }}</p>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { computed } from 'vue'

const { t } = useI18n()
const currentYear = computed(() => new Date().getFullYear())
</script>
```

### Pluralization

```typescript
// In locale file
export default {
  messages: {
    apple: 'no apples | one apple | {count} apples'
  }
}
```

```vue
<template>
  <p>{{ t('messages.apple', count) }}</p>
</template>
```

## Programmatic Language Change

```vue
<script setup lang="ts">
import { useI18n } from 'vue-i18n'

const { locale } = useI18n()

// Change to Italian
locale.value = 'it'

// Change to English
locale.value = 'en'

// Save to localStorage
localStorage.setItem('locale', locale.value)
</script>
```

## Usage in Header

```vue
<template>
  <header class="flex items-center justify-between">
    <h1>{{ t('common.appName') }}</h1>

    <div class="flex items-center gap-3">
      <LanguageSwitcher />
      <ThemeToggle />
      <!-- Other header items -->
    </div>
  </header>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import LanguageSwitcher from '@/components/ui/LanguageSwitcher.vue'
import ThemeToggle from '@/components/ui/ThemeToggle.vue'

const { t } = useI18n()
</script>
```

## Adding New Languages

To add a new language:

1. **Create translation file**:
```typescript
// src/i18n/locales/es.ts
export default {
  common: {
    appName: 'GiftSpire',
    login: 'Iniciar sesión',
    // ...
  }
}
```

2. **Update i18n config**:
```typescript
// src/i18n/index.ts
import es from './locales/es'

const messages = {
  en,
  it,
  es  // Add new language
}
```

3. **Update LanguageSwitcher**:
```vue
<!-- src/components/ui/LanguageSwitcher.vue -->
<script setup lang="ts">
const languages = [
  { code: 'en', name: 'English', flag: '🇬🇧' },
  { code: 'it', name: 'Italiano', flag: '🇮🇹' },
  { code: 'es', name: 'Español', flag: '🇪🇸' }  // Add here
]
</script>
```

## Component Features

### Dropdown Display

The component shows:
- Current language flag
- Language code (EN/IT)
- Dropdown arrow
- Full language name in dropdown
- Checkmark on selected language

### Click Outside to Close

The dropdown automatically closes when clicking outside:

```typescript
const handleClickOutside = (event: MouseEvent) => {
  const target = event.target as HTMLElement
  if (!target.closest('.relative')) {
    isOpen.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})
```

## Accessibility

- **aria-label**: Describes current language
- **Keyboard accessible**: Works with keyboard navigation
- **Screen reader friendly**: Announces language changes
- **Visual indicators**: Flag icons and checkmarks

## Styling

The component uses Tailwind CSS with dark mode support:

```vue
<button
  class="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
>
  <span class="text-lg">{{ currentLanguage.flag }}</span>
  <span>{{ currentLanguage.code.toUpperCase() }}</span>
</button>
```

## Examples

### Custom Language Selector

```vue
<template>
  <div class="language-selector">
    <button
      v-for="lang in languages"
      :key="lang.code"
      @click="changeLanguage(lang.code)"
      :class="{ active: currentLocale === lang.code }"
    >
      {{ lang.flag }} {{ lang.name }}
    </button>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'

const { locale } = useI18n()

const languages = [
  { code: 'en', name: 'English', flag: '🇬🇧' },
  { code: 'it', name: 'Italiano', flag: '🇮🇹' }
]

const currentLocale = computed(() => locale.value)

const changeLanguage = (code: string) => {
  locale.value = code
  localStorage.setItem('locale', code)
}
</script>
```

### Settings Page Integration

```vue
<template>
  <div class="settings">
    <h2>{{ t('settings.language') }}</h2>

    <div class="setting-item">
      <label>{{ t('settings.selectLanguage') }}</label>
      <LanguageSwitcher />
    </div>
  </div>
</template>
```

### Inline Language Buttons

```vue
<template>
  <div class="flex gap-2">
    <button
      @click="setLanguage('en')"
      :class="{ 'ring-2 ring-blue-500': locale === 'en' }"
      class="px-3 py-1 rounded"
    >
      🇬🇧 EN
    </button>
    <button
      @click="setLanguage('it')"
      :class="{ 'ring-2 ring-blue-500': locale === 'it' }"
      class="px-3 py-1 rounded"
    >
      🇮🇹 IT
    </button>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'

const { locale } = useI18n()

const setLanguage = (lang: string) => {
  locale.value = lang
  localStorage.setItem('locale', lang)
}
</script>
```

## Translation Best Practices

1. **Organize by feature**:
```typescript
{
  auth: { /* authentication related */ },
  home: { /* home page */ },
  common: { /* shared across app */ }
}
```

2. **Use descriptive keys**:
```typescript
// Good
t('auth.loginButton')
t('errors.emailRequired')

// Avoid
t('btn1')
t('error')
```

3. **Handle pluralization**:
```typescript
{
  items: 'no items | {n} item | {n} items'
}
```

4. **Include context in translations**:
```typescript
// Instead of just "Save"
{
  saveButton: 'Save Changes',
  saveProfile: 'Save Profile',
  saveSettings: 'Save Settings'
}
```

5. **Keep translations in sync**:
Ensure all locale files have the same keys:
```bash
# en.ts
export default { common: { login: 'Login' } }

# it.ts
export default { common: { login: 'Accedi' } }
```

## Persistence

Language preference is saved to `localStorage`:

```typescript
// Key: 'locale'
// Values: 'en' | 'it'

localStorage.setItem('locale', 'it')
const locale = localStorage.getItem('locale')
```

## RTL Support

For right-to-left languages (if needed in the future):

```vue
<template>
  <div :dir="dir">
    <!-- Content -->
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

const { locale } = useI18n()

const dir = computed(() => {
  return ['ar', 'he'].includes(locale.value) ? 'rtl' : 'ltr'
})
</script>
```
