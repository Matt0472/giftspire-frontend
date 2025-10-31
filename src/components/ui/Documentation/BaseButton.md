# BaseButton Component

A versatile button component with multiple variants and sizes.

## Features

- ✅ Multiple variants (primary, secondary, outline, ghost)
- ✅ Three sizes (sm, md, lg)
- ✅ Button types (button, submit, reset)
- ✅ Disabled state
- ✅ Dark mode support
- ✅ Focus ring for accessibility
- ✅ Smooth transitions
- ✅ Slot support for custom content

## Basic Usage

```vue
<template>
  <BaseButton @click="handleClick">
    Click Me
  </BaseButton>
</template>

<script setup lang="ts">
import BaseButton from '@/components/ui/BaseButton.vue'

const handleClick = () => {
  console.log('Button clicked!')
}
</script>
```

## Variants

```vue
<template>
  <!-- Primary Button (default) -->
  <BaseButton variant="primary">Primary</BaseButton>

  <!-- Secondary Button -->
  <BaseButton variant="secondary">Secondary</BaseButton>

  <!-- Outline Button -->
  <BaseButton variant="outline">Outline</BaseButton>

  <!-- Ghost Button -->
  <BaseButton variant="ghost">Ghost</BaseButton>
</template>
```

## Sizes

```vue
<template>
  <!-- Small -->
  <BaseButton size="sm">Small</BaseButton>

  <!-- Medium (default) -->
  <BaseButton size="md">Medium</BaseButton>

  <!-- Large -->
  <BaseButton size="lg">Large</BaseButton>
</template>
```

## Button Types

```vue
<template>
  <form @submit.prevent="handleSubmit">
    <!-- Submit button -->
    <BaseButton type="submit">Submit Form</BaseButton>

    <!-- Reset button -->
    <BaseButton type="reset">Reset Form</BaseButton>

    <!-- Regular button (default) -->
    <BaseButton type="button">Cancel</BaseButton>
  </form>
</template>
```

## Disabled State

```vue
<template>
  <BaseButton :disabled="isLoading">
    {{ isLoading ? 'Loading...' : 'Submit' }}
  </BaseButton>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const isLoading = ref(false)
</script>
```

## With Icons

```vue
<template>
  <BaseButton variant="primary">
    <LogIn class="w-4 h-4 mr-2" />
    Sign In
  </BaseButton>

  <BaseButton variant="outline">
    Settings
    <Settings class="w-4 h-4 ml-2" />
  </BaseButton>
</template>

<script setup lang="ts">
import { LogIn, Settings } from 'lucide-vue-next'
</script>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `variant` | `'primary' \| 'secondary' \| 'outline' \| 'ghost'` | `'primary'` | Button style variant |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Button size |
| `type` | `'button' \| 'submit' \| 'reset'` | `'button'` | HTML button type |
| `disabled` | `boolean` | `false` | Disable the button |

## Events

| Event | Payload | Description |
|-------|---------|-------------|
| `click` | `MouseEvent` | Emitted when button is clicked |

## Slots

### Default Slot

The default slot is used for button content.

```vue
<template>
  <BaseButton>
    <span class="flex items-center gap-2">
      <CheckCircle class="w-4 h-4" />
      Custom Content
    </span>
  </BaseButton>
</template>
```

## Styling

The component uses Tailwind CSS classes and supports dark mode out of the box.

### Variant Colors

- **Primary**: Blue background with white text
- **Secondary**: Gray background with white text
- **Outline**: Transparent background with border
- **Ghost**: Transparent background, no border

### Size Padding

- **sm**: `px-3 py-1.5 text-sm`
- **md**: `px-4 py-2 text-base`
- **lg**: `px-6 py-3 text-lg`

## Accessibility

- Proper focus ring for keyboard navigation
- Disabled state prevents interaction
- Uses semantic `<button>` element
- Supports all standard button attributes

## Examples

### Loading Button

```vue
<template>
  <BaseButton :disabled="isLoading" @click="handleSubmit">
    <svg
      v-if="isLoading"
      class="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        class="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        stroke-width="4"
      ></circle>
      <path
        class="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      ></path>
    </svg>
    {{ isLoading ? 'Processing...' : 'Submit' }}
  </BaseButton>
</template>
```

### Button Group

```vue
<template>
  <div class="flex gap-2">
    <BaseButton variant="primary">Save</BaseButton>
    <BaseButton variant="outline">Cancel</BaseButton>
    <BaseButton variant="ghost">Delete</BaseButton>
  </div>
</template>
```

### Full Width Button

```vue
<template>
  <BaseButton class="w-full">
    Full Width Button
  </BaseButton>
</template>
```
