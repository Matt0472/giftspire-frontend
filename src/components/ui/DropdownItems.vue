<template>
  <div>
    <template v-for="(item, index) in items" :key="index">
      <!-- Divider -->
      <div
        v-if="item.divider"
        class="my-1 border-t border-gray-200 dark:border-gray-700"
      ></div>

      <!-- Regular Item or Parent Item with Children -->
      <div
        v-else
        class="relative"
        @mouseenter="item.children ? handleMouseEnter(index) : null"
        @mouseleave="item.children ? handleMouseLeave(index) : null"
      >
        <button
          type="button"
          :disabled="item.disabled"
          class="w-full flex items-center justify-between px-4 py-2 text-sm text-left transition-colors"
          :class="[
            item.disabled
              ? 'text-gray-400 dark:text-gray-600 cursor-not-allowed'
              : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700',
            item.children && 'pr-2',
          ]"
          @click="handleClick(item)"
        >
          <span class="flex items-center gap-2">
            <!-- Icon (if provided via slot or prop) -->
            <span v-if="item.icon" v-html="item.icon" class="w-4 h-4"></span>
            {{ item.label }}
          </span>

          <!-- Arrow for nested items -->
          <svg
            v-if="item.children"
            class="w-4 h-4 ml-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M9 5l7 7-7 7"
            />
          </svg>
        </button>

        <!-- Nested Dropdown -->
        <Transition
          enter-active-class="transition ease-out duration-100"
          enter-from-class="transform opacity-0 scale-95"
          enter-to-class="transform opacity-100 scale-100"
          leave-active-class="transition ease-in duration-75"
          leave-from-class="transform opacity-100 scale-100"
          leave-to-class="transform opacity-0 scale-95"
        >
          <div
            v-if="item.children && openSubMenuIndex === index"
            class="absolute left-full top-0 ml-1 rounded-lg shadow-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 py-1 min-w-[12rem] z-50"
          >
            <!-- Recursive call for nested items -->
            <DropdownItems
              :items="item.children"
              :level="level + 1"
              @item-click="handleNestedClick"
              @close="$emit('close')"
            />
          </div>
        </Transition>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { DropdownItem } from '@/types/dropdown'

interface Props {
  items: DropdownItem[]
  level?: number
}

const props = withDefaults(defineProps<Props>(), {
  level: 0,
})

const emit = defineEmits<{
  itemClick: [item: DropdownItem]
  close: []
}>()

const openSubMenuIndex = ref<number | null>(null)
let hoverTimeout: NodeJS.Timeout | null = null

const handleMouseEnter = (index: number) => {
  // Clear any existing timeout
  if (hoverTimeout) {
    clearTimeout(hoverTimeout)
  }

  // Small delay before opening to prevent accidental opens
  hoverTimeout = setTimeout(() => {
    openSubMenuIndex.value = index
  }, 150)
}

const handleMouseLeave = (index: number) => {
  // Clear timeout if mouse leaves before delay completes
  if (hoverTimeout) {
    clearTimeout(hoverTimeout)
  }

  // Small delay before closing to allow mouse to move to submenu
  hoverTimeout = setTimeout(() => {
    if (openSubMenuIndex.value === index) {
      openSubMenuIndex.value = null
    }
  }, 150)
}

const handleClick = (item: DropdownItem) => {
  if (item.disabled) return

  // If item has children, toggle the submenu on click (for touch devices)
  if (item.children) {
    openSubMenuIndex.value = openSubMenuIndex.value === items.indexOf(item) ? null : items.indexOf(item)
  } else {
    // If no children, emit the click event
    emit('itemClick', item)
  }
}

const handleNestedClick = (item: DropdownItem) => {
  // Propagate nested clicks up to the parent
  emit('itemClick', item)
}
</script>
