# BaseModal Component

A flexible and accessible modal dialog component with custom scrollbar styling, backdrop blur, and support for header, body, and footer slots.

## Features

- ✅ Custom scrollbar styling (no arrows, transparent background, contrast thumb)
- ✅ Backdrop blur effect
- ✅ Click outside to close (configurable)
- ✅ ESC key to close (configurable)
- ✅ Smooth transitions and animations
- ✅ Dark mode support
- ✅ Multiple size options
- ✅ Optional close button
- ✅ Teleport to body for proper z-index handling
- ✅ Header, body, and footer slots
- ✅ v-model support for open/close state

## Basic Usage

```vue
<template>
  <div>
    <button @click="isOpen = true">Open Modal</button>

    <BaseModal v-model="isOpen">
      <div class="p-6">
        <h2 class="text-xl font-bold mb-4">Modal Content</h2>
        <p>This is the modal body content.</p>
      </div>
    </BaseModal>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import BaseModal from '@/components/ui/BaseModal.vue'

const isOpen = ref(false)
</script>
```

## With Header and Footer

```vue
<template>
  <BaseModal v-model="isOpen">
    <template #header>
      <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
        <h2 class="text-xl font-bold">Modal Title</h2>
        <p class="text-sm text-gray-500">Modal subtitle or description</p>
      </div>
    </template>

    <div class="px-6 py-4">
      <p>Modal body content goes here.</p>
    </div>

    <template #footer>
      <div class="px-6 py-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
        <div class="flex gap-3 justify-end">
          <button @click="isOpen = false" class="px-4 py-2 border rounded-lg">
            Cancel
          </button>
          <button @click="handleSave" class="px-4 py-2 bg-indigo-600 text-white rounded-lg">
            Save
          </button>
        </div>
      </div>
    </template>
  </BaseModal>
</template>
```

## Size Options

```vue
<template>
  <!-- Small Modal -->
  <BaseModal v-model="isOpen" max-width="sm">
    <div class="p-6">Small modal content</div>
  </BaseModal>

  <!-- Medium Modal -->
  <BaseModal v-model="isOpen" max-width="md">
    <div class="p-6">Medium modal content</div>
  </BaseModal>

  <!-- Large Modal -->
  <BaseModal v-model="isOpen" max-width="lg">
    <div class="p-6">Large modal content</div>
  </BaseModal>

  <!-- Extra Large Modal -->
  <BaseModal v-model="isOpen" max-width="xl">
    <div class="p-6">Extra large modal content</div>
  </BaseModal>

  <!-- 2XL Modal (default) -->
  <BaseModal v-model="isOpen" max-width="2xl">
    <div class="p-6">2XL modal content</div>
  </BaseModal>

  <!-- 3XL Modal -->
  <BaseModal v-model="isOpen" max-width="3xl">
    <div class="p-6">3XL modal content</div>
  </BaseModal>

  <!-- Full Width Modal -->
  <BaseModal v-model="isOpen" max-width="full">
    <div class="p-6">Full width modal content</div>
  </BaseModal>
</template>
```

## Configuration Options

```vue
<template>
  <!-- Disable backdrop click to close -->
  <BaseModal v-model="isOpen" :close-on-backdrop="false">
    <div class="p-6">Click outside won't close this modal</div>
  </BaseModal>

  <!-- Disable ESC key to close -->
  <BaseModal v-model="isOpen" :close-on-escape="false">
    <div class="p-6">ESC key won't close this modal</div>
  </BaseModal>

  <!-- Hide close button -->
  <BaseModal v-model="isOpen" :show-close-button="false">
    <div class="p-6">No close button on this modal</div>
  </BaseModal>

  <!-- All options combined -->
  <BaseModal
    v-model="isOpen"
    max-width="lg"
    :close-on-backdrop="false"
    :close-on-escape="false"
    :show-close-button="false"
  >
    <div class="p-6">Custom configured modal</div>
  </BaseModal>
</template>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `modelValue` | `boolean` | - | Controls modal open/close state (v-model) |
| `maxWidth` | `'sm' \| 'md' \| 'lg' \| 'xl' \| '2xl' \| '3xl' \| 'full'` | `'2xl'` | Maximum width of the modal |
| `closeOnBackdrop` | `boolean` | `true` | Allow closing modal by clicking backdrop |
| `closeOnEscape` | `boolean` | `true` | Allow closing modal by pressing ESC key |
| `showCloseButton` | `boolean` | `true` | Show/hide the close button |

## Events

| Event | Payload | Description |
|-------|---------|-------------|
| `update:modelValue` | `boolean` | Emitted when modal state changes |

## Slots

### Default Slot

The default slot is used for the main modal body content. It has a custom scrollbar when content overflows.

```vue
<template>
  <BaseModal v-model="isOpen">
    <div class="p-6">
      <!-- Your content here -->
      <p>This content will have a custom scrollbar if it overflows</p>
    </div>
  </BaseModal>
</template>
```

### Header Slot

The header slot is displayed at the top of the modal. The close button is automatically positioned in the top-right corner when a header is provided.

```vue
<template>
  <BaseModal v-model="isOpen">
    <template #header>
      <div class="px-6 py-4 bg-gradient-to-r from-indigo-50 to-purple-50">
        <h2 class="text-2xl font-bold">Beautiful Header</h2>
      </div>
    </template>
    <!-- Body content -->
  </BaseModal>
</template>
```

### Footer Slot

The footer slot is displayed at the bottom of the modal, typically used for action buttons.

```vue
<template>
  <BaseModal v-model="isOpen">
    <!-- Header and body -->
    <template #footer>
      <div class="px-6 py-4 bg-gray-50 border-t">
        <div class="flex justify-between">
          <button class="px-4 py-2">Secondary Action</button>
          <button class="px-4 py-2 bg-indigo-600 text-white">Primary Action</button>
        </div>
      </div>
    </template>
  </BaseModal>
</template>
```

## Scrollbar Styling

The modal body has custom scrollbar styling:

- **Width**: 8px thin scrollbar
- **Track**: Transparent background (no visible track)
- **Thumb**: Indigo color with transparency
  - Light mode: `rgba(99, 102, 241, 0.5)`
  - Dark mode: `rgba(139, 92, 246, 0.6)`
- **Hover**: Slightly more opaque
- **Arrows**: Hidden (no up/down buttons)
- **Border radius**: Rounded thumb

The scrollbar automatically adapts to light and dark modes.

## Accessibility

- Modal content is teleported to the body for proper layering
- ESC key closes the modal (configurable)
- Backdrop click closes the modal (configurable)
- Close button with proper hover states
- Smooth transitions for better UX
- Focus is contained within the modal when open

## Examples

### Confirmation Dialog

```vue
<template>
  <BaseModal v-model="showConfirm" max-width="md">
    <template #header>
      <div class="px-6 py-4 border-b border-gray-200">
        <h2 class="text-xl font-bold text-gray-900">Confirm Action</h2>
      </div>
    </template>

    <div class="px-6 py-4">
      <p class="text-gray-600">Are you sure you want to delete this item? This action cannot be undone.</p>
    </div>

    <template #footer>
      <div class="px-6 py-4 bg-gray-50 border-t flex justify-end gap-3">
        <button
          @click="showConfirm = false"
          class="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100"
        >
          Cancel
        </button>
        <button
          @click="handleDelete"
          class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
        >
          Delete
        </button>
      </div>
    </template>
  </BaseModal>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const showConfirm = ref(false)

const handleDelete = () => {
  // Delete logic here
  showConfirm.value = false
}
</script>
```

### Notification List Modal

```vue
<template>
  <BaseModal v-model="showNotifications" max-width="2xl">
    <template #header>
      <div class="px-6 py-4 bg-gradient-to-r from-indigo-50 to-purple-50">
        <div class="flex items-center gap-3">
          <Bell class="w-6 h-6 text-indigo-600" />
          <div>
            <h2 class="text-xl font-bold">Notifications</h2>
            <p class="text-sm text-gray-500">{{ notifications.length }} total</p>
          </div>
        </div>
      </div>
    </template>

    <div>
      <div
        v-for="notification in notifications"
        :key="notification.id"
        class="px-6 py-4 border-b hover:bg-gray-50"
      >
        <h3 class="font-semibold">{{ notification.title }}</h3>
        <p class="text-sm text-gray-600">{{ notification.message }}</p>
      </div>
    </div>

    <template #footer>
      <div class="px-6 py-4 bg-gray-50 border-t">
        <p class="text-xs text-center text-gray-500">
          Showing all {{ notifications.length }} notifications
        </p>
      </div>
    </template>
  </BaseModal>
</template>
```

### Form Modal

```vue
<template>
  <BaseModal v-model="showForm" max-width="lg" :close-on-backdrop="false">
    <template #header>
      <div class="px-6 py-4 border-b">
        <h2 class="text-xl font-bold">Create New Item</h2>
        <p class="text-sm text-gray-500">Fill in the information below</p>
      </div>
    </template>

    <form @submit.prevent="handleSubmit" class="px-6 py-4">
      <div class="space-y-4">
        <div>
          <label class="block text-sm font-medium mb-2">Name</label>
          <input
            v-model="form.name"
            type="text"
            class="w-full px-4 py-2 border rounded-lg"
            required
          />
        </div>
        <div>
          <label class="block text-sm font-medium mb-2">Description</label>
          <textarea
            v-model="form.description"
            class="w-full px-4 py-2 border rounded-lg"
            rows="4"
          />
        </div>
      </div>
    </form>

    <template #footer>
      <div class="px-6 py-4 bg-gray-50 border-t flex justify-end gap-3">
        <button
          @click="showForm = false"
          type="button"
          class="px-4 py-2 border rounded-lg"
        >
          Cancel
        </button>
        <button
          @click="handleSubmit"
          type="submit"
          class="px-4 py-2 bg-indigo-600 text-white rounded-lg"
        >
          Create
        </button>
      </div>
    </template>
  </BaseModal>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const showForm = ref(false)
const form = ref({
  name: '',
  description: ''
})

const handleSubmit = () => {
  // Form submission logic
  console.log('Form data:', form.value)
  showForm.value = false
}
</script>
```

## Styling

The component uses Tailwind CSS classes and supports dark mode automatically.

### Modal Sizes

- **sm**: max-w-sm (384px)
- **md**: max-w-md (448px)
- **lg**: max-w-lg (512px)
- **xl**: max-w-xl (576px)
- **2xl**: max-w-2xl (672px) - Default
- **3xl**: max-w-3xl (768px)
- **full**: max-w-full

### Backdrop

- Background: Black with 50% opacity
- Backdrop blur effect
- Smooth fade in/out transitions

### Modal Container

- Border radius: 3xl (1.5rem)
- Shadow: 2xl
- Max height: 90vh
- Overflow: Hidden

## Notes

- The modal is automatically teleported to the document body for proper z-index layering
- The body slot has custom scrollbar styling that matches your design system
- All transitions are smooth with cubic-bezier easing
- Dark mode colors are automatically applied based on system preferences
- The modal closes when clicking the backdrop, pressing ESC, or clicking the close button (all configurable)
