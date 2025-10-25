<template>
  <div ref="dropdownRef" class="relative inline-block" :class="containerClass">
    <!-- Trigger Slot -->
    <div @click="toggleDropdown" class="cursor-pointer">
      <slot name="trigger" :isOpen="isOpen">
        <button
          type="button"
          class="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          :class="{ 'ring-2 ring-blue-500': isOpen }"
        >
          {{ triggerText }}
          <svg
            class="w-4 h-4 transition-transform"
            :class="{ 'rotate-180': isOpen }"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </button>
      </slot>
    </div>

    <!-- Dropdown Menu -->
    <Transition
      enter-active-class="transition ease-out duration-100"
      enter-from-class="transform opacity-0 scale-95"
      enter-to-class="transform opacity-100 scale-100"
      leave-active-class="transition ease-in duration-75"
      leave-from-class="transform opacity-100 scale-100"
      leave-to-class="transform opacity-0 scale-95"
    >
      <div
        v-if="isOpen"
        class="absolute z-50 mt-2 rounded-lg shadow-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 py-1"
        :class="[dropdownClass, positionClass]"
        :style="{ minWidth: minWidth }"
      >
        <!-- Custom Content Slot -->
        <slot name="content" :close="closeDropdown">
          <!-- Default Items Rendering -->
          <DropdownItems
            v-if="items && items.length > 0"
            :items="items"
            :level="0"
            @item-click="handleItemClick"
            @close="closeDropdown"
          />
        </slot>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue'
import type { DropdownItem } from '@/types/dropdown'
import DropdownItems from './DropdownItems.vue'

interface Props {
  items?: DropdownItem[]
  triggerText?: string
  position?: 'left' | 'right' | 'center'
  minWidth?: string
  containerClass?: string
  dropdownClass?: string
  closeOnClick?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  triggerText: 'Open Menu',
  position: 'left',
  minWidth: '12rem',
  containerClass: '',
  dropdownClass: '',
  closeOnClick: true,
})

const emit = defineEmits<{
  open: []
  close: []
  itemClick: [item: DropdownItem]
}>()

const isOpen = ref(false)
const dropdownRef = ref<HTMLElement | null>(null)

const positionClass = computed(() => {
  switch (props.position) {
    case 'right':
      return 'right-0'
    case 'center':
      return 'left-1/2 -translate-x-1/2'
    case 'left':
    default:
      return 'left-0'
  }
})

const toggleDropdown = () => {
  isOpen.value = !isOpen.value
  if (isOpen.value) {
    emit('open')
  } else {
    emit('close')
  }
}

const closeDropdown = () => {
  isOpen.value = false
  emit('close')
}

const handleItemClick = (item: DropdownItem) => {
  emit('itemClick', item)
  if (item.onClick) {
    item.onClick()
  }
  if (props.closeOnClick && !item.children) {
    closeDropdown()
  }
}

// Close dropdown when clicking outside
const handleClickOutside = (event: MouseEvent) => {
  if (dropdownRef.value && !dropdownRef.value.contains(event.target as Node)) {
    closeDropdown()
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})

// Expose methods for programmatic control
defineExpose({
  close: closeDropdown,
  toggle: toggleDropdown,
  isOpen,
})
</script>
