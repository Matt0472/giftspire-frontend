# BaseDropdown Component

A flexible, reusable dropdown component with support for nested dropdowns.

## Features

- ✅ Nested dropdown support (unlimited levels)
- ✅ Customizable trigger via slots
- ✅ Custom content via slots
- ✅ Click outside to close
- ✅ Keyboard navigation ready
- ✅ Dark mode support
- ✅ Smooth transitions
- ✅ TypeScript support
- ✅ Configurable positioning (left, right, center)
- ✅ Hover to open nested menus
- ✅ Disabled items support
- ✅ Dividers support

## Basic Usage

```vue
<template>
  <BaseDropdown
    :items="menuItems"
    trigger-text="Open Menu"
    @item-click="handleItemClick"
  />
</template>

<script setup lang="ts">
import BaseDropdown from '@/components/ui/BaseDropdown.vue'
import type { DropdownItem } from '@/types/dropdown'

const menuItems: DropdownItem[] = [
  { label: 'Profile', value: 'profile' },
  { label: 'Settings', value: 'settings' },
  { divider: true },
  { label: 'Logout', value: 'logout' },
]

const handleItemClick = (item: DropdownItem) => {
  console.log('Clicked:', item)
}
</script>
```

## Nested Dropdown

```vue
<script setup lang="ts">
const nestedItems: DropdownItem[] = [
  { label: 'Dashboard', value: 'dashboard' },
  {
    label: 'Products',
    value: 'products',
    children: [
      { label: 'All Products', value: 'all-products' },
      {
        label: 'Categories',
        value: 'categories',
        children: [
          { label: 'Electronics', value: 'electronics' },
          { label: 'Clothing', value: 'clothing' },
        ],
      },
    ],
  },
]
</script>
```

## Custom Trigger

```vue
<template>
  <BaseDropdown :items="items">
    <template #trigger="{ isOpen }">
      <button class="custom-button" :class="{ active: isOpen }">
        Custom Trigger
      </button>
    </template>
  </BaseDropdown>
</template>
```

## Custom Content

```vue
<template>
  <BaseDropdown trigger-text="Custom">
    <template #content="{ close }">
      <div class="p-4">
        <p>Custom content here</p>
        <button @click="close()">Close</button>
      </div>
    </template>
  </BaseDropdown>
</template>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `items` | `DropdownItem[]` | `[]` | Array of dropdown items |
| `triggerText` | `string` | `'Open Menu'` | Default trigger button text |
| `position` | `'left' \| 'right' \| 'center'` | `'left'` | Dropdown alignment |
| `minWidth` | `string` | `'12rem'` | Minimum width of dropdown |
| `containerClass` | `string` | `''` | Additional classes for container |
| `dropdownClass` | `string` | `''` | Additional classes for dropdown |
| `closeOnClick` | `boolean` | `true` | Close dropdown on item click |

## Events

| Event | Payload | Description |
|-------|---------|-------------|
| `open` | - | Emitted when dropdown opens |
| `close` | - | Emitted when dropdown closes |
| `itemClick` | `DropdownItem` | Emitted when an item is clicked |

## DropdownItem Type

```typescript
interface DropdownItem {
  label: string           // Display text
  value?: string | number // Item value
  icon?: string          // Icon HTML (optional)
  disabled?: boolean     // Disable item
  divider?: boolean      // Render as divider
  children?: DropdownItem[] // Nested items
  onClick?: () => void   // Click handler
}
```

## Slots

### `trigger`

Custom trigger element. Receives `isOpen` boolean.

```vue
<template #trigger="{ isOpen }">
  <!-- Your custom trigger -->
</template>
```

### `content`

Custom dropdown content. Receives `close` function.

```vue
<template #content="{ close }">
  <!-- Your custom content -->
</template>
```

## Exposed Methods

You can access these methods via template ref:

```vue
<template>
  <BaseDropdown ref="dropdownRef" :items="items" />
  <button @click="dropdownRef?.toggle()">Toggle Programmatically</button>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const dropdownRef = ref()
</script>
```

Methods:
- `close()` - Close the dropdown
- `toggle()` - Toggle dropdown state
- `isOpen` - Reactive boolean for dropdown state

## Examples

See `src/components/examples/DropdownExample.vue` for comprehensive examples including:
- Simple dropdowns
- Nested dropdowns (multiple levels)
- Custom triggers
- Custom content
- Different positioning
- Integration patterns
