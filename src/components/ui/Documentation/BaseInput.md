# BaseInput Component

A flexible input component with label, error states, icons, and password visibility toggle.

## Features

- ✅ Label support with required indicator
- ✅ Error state with error messages
- ✅ Helper text/hints
- ✅ Left and right icon slots
- ✅ Password visibility toggle
- ✅ Disabled state
- ✅ Dark mode support
- ✅ v-model support
- ✅ All standard HTML input types
- ✅ Autocomplete support
- ✅ Focus and blur events

## Basic Usage

```vue
<template>
  <BaseInput
    v-model="email"
    type="email"
    label="Email Address"
    placeholder="Enter your email"
  />
</template>

<script setup lang="ts">
import { ref } from 'vue'
import BaseInput from '@/components/ui/BaseInput.vue'

const email = ref('')
</script>
```

## With Label

```vue
<template>
  <BaseInput
    v-model="username"
    label="Username"
    placeholder="Enter username"
  />
</template>
```

## Required Field

```vue
<template>
  <BaseInput
    v-model="name"
    label="Full Name"
    placeholder="Enter your name"
    required
  />
</template>
```

## With Error

```vue
<template>
  <BaseInput
    v-model="email"
    type="email"
    label="Email"
    :error="emailError"
  />
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

const email = ref('')
const emailError = computed(() => {
  if (!email.value) return 'Email is required'
  if (!email.value.includes('@')) return 'Invalid email format'
  return ''
})
</script>
```

## With Helper Text

```vue
<template>
  <BaseInput
    v-model="username"
    label="Username"
    hint="Must be at least 3 characters"
  />
</template>
```

## Password Input

```vue
<template>
  <!-- With password toggle (default) -->
  <BaseInput
    v-model="password"
    type="password"
    label="Password"
    placeholder="Enter password"
  />

  <!-- Without password toggle -->
  <BaseInput
    v-model="password"
    type="password"
    label="Password"
    :show-password-toggle="false"
  />
</template>
```

## With Icons

```vue
<template>
  <!-- Left icon -->
  <BaseInput
    v-model="email"
    type="email"
    label="Email"
  >
    <template #leftIcon>
      <Mail class="w-5 h-5" />
    </template>
  </BaseInput>

  <!-- Right icon -->
  <BaseInput
    v-model="search"
    label="Search"
  >
    <template #rightIcon>
      <Search class="w-5 h-5" />
    </template>
  </BaseInput>

  <!-- Both icons -->
  <BaseInput
    v-model="amount"
    type="number"
    label="Amount"
  >
    <template #leftIcon>
      <DollarSign class="w-5 h-5" />
    </template>
    <template #rightIcon>
      <Info class="w-5 h-5" />
    </template>
  </BaseInput>
</template>

<script setup lang="ts">
import { Mail, Search, DollarSign, Info } from 'lucide-vue-next'
</script>
```

## Disabled State

```vue
<template>
  <BaseInput
    v-model="value"
    label="Disabled Input"
    disabled
  />
</template>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `modelValue` | `string \| number` | - | Input value (v-model) |
| `id` | `string` | - | Input ID attribute |
| `type` | `string` | `'text'` | HTML input type |
| `label` | `string` | - | Input label |
| `placeholder` | `string` | - | Placeholder text |
| `error` | `string` | - | Error message to display |
| `hint` | `string` | - | Helper text to display |
| `disabled` | `boolean` | `false` | Disable the input |
| `required` | `boolean` | `false` | Show required indicator |
| `autocomplete` | `string` | `'off'` | Autocomplete attribute |
| `showPasswordToggle` | `boolean` | `true` | Show password visibility toggle |

## Events

| Event | Payload | Description |
|-------|---------|-------------|
| `update:modelValue` | `string` | Emitted when value changes |
| `blur` | `FocusEvent` | Emitted when input loses focus |
| `focus` | `FocusEvent` | Emitted when input gains focus |

## Slots

### `leftIcon`

Display an icon on the left side of the input.

```vue
<template>
  <BaseInput v-model="search">
    <template #leftIcon>
      <Search class="w-5 h-5" />
    </template>
  </BaseInput>
</template>
```

### `rightIcon`

Display an icon on the right side of the input.

```vue
<template>
  <BaseInput v-model="value">
    <template #rightIcon>
      <Info class="w-5 h-5" />
    </template>
  </BaseInput>
</template>
```

**Note**: For password inputs, the right icon slot is used by the password toggle button by default. You can disable this with `:show-password-toggle="false"`.

## Input Types

The component supports all standard HTML input types:

- `text` (default)
- `email`
- `password` (includes visibility toggle)
- `number`
- `tel`
- `url`
- `search`
- `date`
- `time`
- `datetime-local`
- And more...

## Examples

### Login Form

```vue
<template>
  <form @submit.prevent="handleLogin">
    <BaseInput
      v-model="email"
      type="email"
      label="Email"
      placeholder="Enter your email"
      :error="errors.email"
      required
      autocomplete="email"
    >
      <template #leftIcon>
        <Mail class="w-5 h-5" />
      </template>
    </BaseInput>

    <BaseInput
      v-model="password"
      type="password"
      label="Password"
      placeholder="Enter your password"
      :error="errors.password"
      required
      autocomplete="current-password"
      class="mt-4"
    >
      <template #leftIcon>
        <Lock class="w-5 h-5" />
      </template>
    </BaseInput>

    <BaseButton type="submit" class="mt-6 w-full">
      Sign In
    </BaseButton>
  </form>
</template>
```

### Search Input

```vue
<template>
  <BaseInput
    v-model="searchQuery"
    type="search"
    placeholder="Search..."
    @input="handleSearch"
  >
    <template #leftIcon>
      <Search class="w-5 h-5" />
    </template>
  </BaseInput>
</template>
```

### Number Input with Currency

```vue
<template>
  <BaseInput
    v-model="price"
    type="number"
    label="Price"
    placeholder="0.00"
    hint="Enter amount in USD"
  >
    <template #leftIcon>
      <span class="text-gray-500">$</span>
    </template>
  </BaseInput>
</template>
```

## Accessibility

- Proper label association with `for` attribute
- Required fields show asterisk indicator
- Error messages are properly associated
- Focus states with visible ring
- Support for all ARIA attributes
- Screen reader friendly error messages

## Styling

The component uses Tailwind CSS and supports:
- Dark mode color schemes
- Error states (red border)
- Disabled states (grayed out)
- Focus states (blue ring)
- Icon padding adjustments
