<template>
  <div class="p-8 space-y-8">
    <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-8">
      BaseDropdown Component Examples
    </h1>

    <!-- Example 1: Simple Dropdown -->
    <div class="space-y-4">
      <h2 class="text-xl font-semibold text-gray-800 dark:text-gray-200">
        1. Simple Dropdown
      </h2>
      <BaseDropdown
        :items="simpleItems"
        trigger-text="Simple Menu"
        @item-click="handleItemClick"
      />
    </div>

    <!-- Example 2: Dropdown with Nested Items -->
    <div class="space-y-4">
      <h2 class="text-xl font-semibold text-gray-800 dark:text-gray-200">
        2. Dropdown with Nested Items
      </h2>
      <BaseDropdown
        :items="nestedItems"
        trigger-text="Nested Menu"
        @item-click="handleItemClick"
      />
    </div>

    <!-- Example 3: Custom Trigger Slot -->
    <div class="space-y-4">
      <h2 class="text-xl font-semibold text-gray-800 dark:text-gray-200">
        3. Custom Trigger (Avatar Menu)
      </h2>
      <BaseDropdown :items="userMenuItems" @item-click="handleItemClick">
        <template #trigger="{ isOpen }">
          <button
            class="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            :class="{ 'bg-gray-100 dark:bg-gray-800': isOpen }"
          >
            <div
              class="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-semibold"
            >
              JD
            </div>
            <span class="text-gray-700 dark:text-gray-300">John Doe</span>
            <svg
              class="w-4 h-4 text-gray-500 transition-transform"
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
        </template>
      </BaseDropdown>
    </div>

    <!-- Example 4: Right-Aligned Dropdown -->
    <div class="space-y-4 flex justify-end">
      <div class="space-y-4">
        <h2 class="text-xl font-semibold text-gray-800 dark:text-gray-200">
          4. Right-Aligned Dropdown
        </h2>
        <BaseDropdown
          :items="settingsItems"
          trigger-text="Settings"
          position="right"
          @item-click="handleItemClick"
        />
      </div>
    </div>

    <!-- Example 5: Custom Content Slot -->
    <div class="space-y-4">
      <h2 class="text-xl font-semibold text-gray-800 dark:text-gray-200">
        5. Custom Content Slot
      </h2>
      <BaseDropdown trigger-text="Color Picker">
        <template #content="{ close }">
          <div class="p-4 space-y-3">
            <h3 class="font-semibold text-gray-900 dark:text-white text-sm">
              Choose a color
            </h3>
            <div class="grid grid-cols-5 gap-2">
              <button
                v-for="color in colors"
                :key="color"
                @click="selectColor(color, close)"
                class="w-8 h-8 rounded-full border-2 border-gray-300 dark:border-gray-600 hover:scale-110 transition-transform"
                :style="{ backgroundColor: color }"
                :title="color"
              ></button>
            </div>
          </div>
        </template>
      </BaseDropdown>
      <p v-if="selectedColor" class="text-sm text-gray-600 dark:text-gray-400">
        Selected color: <span :style="{ color: selectedColor }">{{ selectedColor }}</span>
      </p>
    </div>

    <!-- Result Display -->
    <div
      v-if="lastClickedItem"
      class="mt-8 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg"
    >
      <p class="text-sm font-semibold text-blue-900 dark:text-blue-100">
        Last clicked item:
      </p>
      <p class="text-sm text-blue-800 dark:text-blue-200">
        {{ lastClickedItem.label }} (value: {{ lastClickedItem.value }})
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import BaseDropdown from '@/components/ui/BaseDropdown.vue'
import type { DropdownItem } from '@/types/dropdown'

const lastClickedItem = ref<DropdownItem | null>(null)
const selectedColor = ref<string>('')

const colors = [
  '#ef4444',
  '#f59e0b',
  '#10b981',
  '#3b82f6',
  '#8b5cf6',
  '#ec4899',
  '#6366f1',
  '#14b8a6',
  '#f97316',
  '#06b6d4',
]

// Simple Items
const simpleItems: DropdownItem[] = [
  { label: 'Profile', value: 'profile' },
  { label: 'Settings', value: 'settings' },
  { divider: true },
  { label: 'Logout', value: 'logout' },
]

// Nested Items
const nestedItems: DropdownItem[] = [
  { label: 'Dashboard', value: 'dashboard' },
  {
    label: 'Products',
    value: 'products',
    children: [
      { label: 'All Products', value: 'all-products' },
      { label: 'Categories', value: 'categories' },
      {
        label: 'Inventory',
        value: 'inventory',
        children: [
          { label: 'Stock Levels', value: 'stock-levels' },
          { label: 'Reorder Points', value: 'reorder-points' },
          { label: 'Suppliers', value: 'suppliers' },
        ],
      },
      { label: 'Pricing', value: 'pricing' },
    ],
  },
  {
    label: 'Reports',
    value: 'reports',
    children: [
      { label: 'Sales Report', value: 'sales-report' },
      { label: 'Analytics', value: 'analytics' },
      {
        label: 'Custom Reports',
        value: 'custom-reports',
        children: [
          { label: 'Create New', value: 'create-report' },
          { label: 'Saved Reports', value: 'saved-reports' },
          { label: 'Scheduled Reports', value: 'scheduled-reports' },
        ],
      },
    ],
  },
  { divider: true },
  { label: 'Help', value: 'help' },
]

// User Menu Items
const userMenuItems: DropdownItem[] = [
  { label: 'My Profile', value: 'my-profile' },
  { label: 'Account Settings', value: 'account-settings' },
  {
    label: 'Preferences',
    value: 'preferences',
    children: [
      { label: 'Language', value: 'language' },
      { label: 'Theme', value: 'theme' },
      { label: 'Notifications', value: 'notifications' },
    ],
  },
  { divider: true },
  { label: 'Logout', value: 'logout' },
]

// Settings Items
const settingsItems: DropdownItem[] = [
  { label: 'General', value: 'general' },
  {
    label: 'Privacy',
    value: 'privacy',
    children: [
      { label: 'Data Sharing', value: 'data-sharing' },
      { label: 'Cookies', value: 'cookies' },
      { label: 'Activity Log', value: 'activity-log' },
    ],
  },
  {
    label: 'Security',
    value: 'security',
    children: [
      { label: 'Password', value: 'password' },
      { label: 'Two-Factor Auth', value: '2fa' },
      { label: 'Active Sessions', value: 'active-sessions' },
    ],
  },
  { divider: true },
  { label: 'About', value: 'about' },
]

const handleItemClick = (item: DropdownItem) => {
  lastClickedItem.value = item
  console.log('Clicked item:', item)
}

const selectColor = (color: string, close: () => void) => {
  selectedColor.value = color
  close()
}
</script>
