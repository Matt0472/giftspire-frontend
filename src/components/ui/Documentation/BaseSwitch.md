# BaseSwitch Component

A modern toggle switch component with smooth animations and full accessibility support.

## Features

- ✅ Three sizes (sm, md, lg)
- ✅ v-model support for two-way binding
- ✅ Optional label
- ✅ Disabled state
- ✅ Dark mode support
- ✅ Focus ring for accessibility
- ✅ Smooth animations
- ✅ Full ARIA support for screen readers

## Basic Usage

```vue
<template>
  <BaseSwitch v-model="isEnabled" label="Enable notifications" />
</template>

<script setup lang="ts">
import { ref } from 'vue'
import BaseSwitch from '@/components/ui/BaseSwitch.vue'

const isEnabled = ref(false)
</script>
```

## Without Label

```vue
<template>
  <div class="flex items-center gap-3">
    <span class="text-sm">Notifications</span>
    <BaseSwitch v-model="notifications" />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const notifications = ref(true)
</script>
```

## Sizes

```vue
<template>
  <!-- Small -->
  <BaseSwitch v-model="small" size="sm" label="Small switch" />

  <!-- Medium (default) -->
  <BaseSwitch v-model="medium" size="md" label="Medium switch" />

  <!-- Large -->
  <BaseSwitch v-model="large" size="lg" label="Large switch" />
</template>

<script setup lang="ts">
import { ref } from 'vue'

const small = ref(false)
const medium = ref(false)
const large = ref(false)
</script>
```

## Disabled State

```vue
<template>
  <BaseSwitch v-model="value" label="Disabled switch" :disabled="true" />
</template>

<script setup lang="ts">
import { ref } from 'vue'

const value = ref(false)
</script>
```

## With Custom Styling

```vue
<template>
  <div class="flex items-start space-x-3">
    <BaseSwitch v-model="agreed" />
    <div class="flex-1">
      <label class="text-sm font-medium text-gray-900 dark:text-white">
        Terms and Conditions
      </label>
      <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">
        I agree to the terms and conditions and privacy policy.
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const agreed = ref(false)
</script>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `modelValue` | `boolean` | `false` | The current state of the switch (required for v-model) |
| `label` | `string` | `undefined` | Optional label text displayed next to the switch |
| `disabled` | `boolean` | `false` | Disable the switch |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Switch size |

## Events

| Event | Payload | Description |
|-------|---------|-------------|
| `update:modelValue` | `boolean` | Emitted when the switch is toggled (required for v-model) |

## Accessibility

- Uses proper ARIA attributes (`role="switch"`, `aria-checked`)
- Keyboard accessible (Space/Enter to toggle)
- Focus visible indicator
- Associated label with unique ID for screen readers
- Proper disabled state handling

## Examples

### Settings Panel

```vue
<template>
  <div class="space-y-4">
    <div class="flex items-center justify-between">
      <div>
        <h3 class="text-sm font-medium text-gray-900 dark:text-white">
          Email Notifications
        </h3>
        <p class="text-xs text-gray-500 dark:text-gray-400">
          Receive notifications about your account activity
        </p>
      </div>
      <BaseSwitch v-model="settings.emailNotifications" />
    </div>

    <div class="flex items-center justify-between">
      <div>
        <h3 class="text-sm font-medium text-gray-900 dark:text-white">
          Push Notifications
        </h3>
        <p class="text-xs text-gray-500 dark:text-gray-400">
          Get push notifications on your device
        </p>
      </div>
      <BaseSwitch v-model="settings.pushNotifications" />
    </div>

    <div class="flex items-center justify-between">
      <div>
        <h3 class="text-sm font-medium text-gray-900 dark:text-white">
          Marketing Emails
        </h3>
        <p class="text-xs text-gray-500 dark:text-gray-400">
          Receive emails about new features and updates
        </p>
      </div>
      <BaseSwitch v-model="settings.marketingEmails" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive } from 'vue'

const settings = reactive({
  emailNotifications: true,
  pushNotifications: false,
  marketingEmails: false,
})
</script>
```

### Form Integration

```vue
<template>
  <form @submit.prevent="handleSubmit">
    <div class="space-y-4">
      <BaseInput v-model="email" label="Email" type="email" />

      <BaseSwitch v-model="agreeToTerms" label="I agree to the terms and conditions" />

      <BaseButton type="submit" :disabled="!agreeToTerms">
        Submit
      </BaseButton>
    </div>
  </form>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const email = ref('')
const agreeToTerms = ref(false)

const handleSubmit = () => {
  console.log('Form submitted', { email: email.value, agreeToTerms: agreeToTerms.value })
}
</script>
```

### With Watchers

```vue
<template>
  <BaseSwitch v-model="darkMode" label="Dark Mode" />
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'

const darkMode = ref(false)

watch(darkMode, (newValue) => {
  if (newValue) {
    document.documentElement.classList.add('dark')
  } else {
    document.documentElement.classList.remove('dark')
  }
})
</script>
```

## Styling

The component uses Tailwind CSS classes and supports dark mode out of the box.

### Size Dimensions

- **sm**: Switch height 20px (5 Tailwind units), toggle 16px
- **md**: Switch height 24px (6 Tailwind units), toggle 20px
- **lg**: Switch height 28px (7 Tailwind units), toggle 24px

### Colors

- **Off state**: Gray background (`bg-gray-200` / `bg-gray-700` in dark mode)
- **On state**: Indigo background (`bg-indigo-600` / `bg-indigo-500` in dark mode)
- **Toggle**: White circle with shadow
- **Focus**: Indigo focus ring

## Best Practices

1. Always provide a label for accessibility, either via the `label` prop or custom markup
2. Use appropriate size based on context (sm for compact UIs, lg for touch interfaces)
3. Provide clear visual feedback for the current state
4. Consider adding descriptive text for complex settings
5. Use `disabled` state when the switch can't be changed due to permissions or dependencies
