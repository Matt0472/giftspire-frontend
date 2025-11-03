<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { LogOut, Menu, X, Bell } from 'lucide-vue-next'
import { useAuthStore } from '@/stores/auth'
import { useAuth } from '@/composables/useAuth'
import { useNotificationStore, type Notification } from '@/stores/notification'
import { formatRelativeTime } from '@/utils/time'
import ThemeToggle from '../ui/ThemeToggle.vue'
import LanguageSwitcher from '../ui/LanguageSwitcher.vue'
import BaseButton from '../ui/BaseButton.vue'
import BaseModal from '../ui/BaseModal.vue'

const router = useRouter()
const authStore = useAuthStore()
const { logout } = useAuth()
const { t } = useI18n()
const notificationStore = useNotificationStore()

const isMobileMenuOpen = ref(false)
const isDropdownOpen = ref(false)
const isNotificationOpen = ref(false)
const isNotificationModalOpen = ref(false)
const dropdownRef = ref<HTMLDivElement | null>(null)
const notificationRef = ref<HTMLDivElement | null>(null)

// Use real notifications from the store
const notifications = computed(() => notificationStore.notifications)
const unreadCount = computed(() => notificationStore.unreadCount)

const handleLogin = () => {
  router.push('/login')
  isMobileMenuOpen.value = false
}

const handleSignup = () => {
  router.push('/register')
  isMobileMenuOpen.value = false
}

const handleLogout = async () => {
  await logout()
  isMobileMenuOpen.value = false
  isDropdownOpen.value = false
}

const toggleMobileMenu = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value
}

const toggleDropdown = () => {
  isDropdownOpen.value = !isDropdownOpen.value
  if (isDropdownOpen.value) {
    isNotificationOpen.value = false
  }
}

const toggleNotifications = () => {
  isNotificationOpen.value = !isNotificationOpen.value
  if (isNotificationOpen.value) {
    isDropdownOpen.value = false
  }
}

const markAsRead = (id: string | number) => {
  notificationStore.markAsRead(id)
}

const handleNotificationClick = (notification: Notification) => {
  markAsRead(notification.id)

  // If notification has a searchId, navigate to results page
  if (notification.searchId) {
    isNotificationOpen.value = false
    isNotificationModalOpen.value = false
    router.push({ name: 'searchResults', params: { id: notification.searchId } })
  }
}

const markAllAsRead = () => {
  notificationStore.markAllAsRead()
}

const clearAllNotifications = () => {
  notificationStore.clearAll()
}

const openNotificationModal = () => {
  isNotificationModalOpen.value = true
  isNotificationOpen.value = false
  isDropdownOpen.value = false
  isMobileMenuOpen.value = false
}

// Get user initials (first 2 letters of nickname, capitalized)
const userInitials = computed(() => {
  const nickname = authStore.user?.display_name || ''
  return nickname.substring(0, 2).toUpperCase()
})

// Generate a consistent color based on nickname
const avatarColor = computed(() => {
  const nickname = authStore.user?.display_name || ''
  const colors = [
    'bg-gradient-to-br from-purple-500 to-pink-500',
    'bg-gradient-to-br from-blue-500 to-cyan-500',
    'bg-gradient-to-br from-green-500 to-emerald-500',
    'bg-gradient-to-br from-orange-500 to-red-500',
    'bg-gradient-to-br from-indigo-500 to-purple-500',
    'bg-gradient-to-br from-pink-500 to-rose-500',
    'bg-gradient-to-br from-teal-500 to-green-500',
    'bg-gradient-to-br from-yellow-500 to-orange-500',
  ]

  let hash = 0
  for (let i = 0; i < nickname.length; i++) {
    hash = nickname.charCodeAt(i) + ((hash << 5) - hash)
  }

  return colors[Math.abs(hash) % colors.length]
})

// Close dropdown when clicking outside
const handleClickOutside = (event: MouseEvent) => {
  if (dropdownRef.value && !dropdownRef.value.contains(event.target as Node)) {
    isDropdownOpen.value = false
  }
  if (notificationRef.value && !notificationRef.value.contains(event.target as Node)) {
    isNotificationOpen.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<template>
  <header class="bg-white dark:bg-gray-900 shadow dark:shadow-gray-700">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
      <div class="flex items-center justify-between">
        <router-link to="/">
          <h1 class="text-2xl font-bold text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer">
            {{ t('common.appName') }}
          </h1>
        </router-link>

        <!-- Desktop Menu (hidden on mobile) -->
        <div class="hidden sm:flex items-center gap-3">
          <!-- Authenticated User Menu -->
          <template v-if="authStore.isAuthenticated">
            <!-- Notification Bell -->
            <div class="relative" ref="notificationRef">
              <button
                @click="toggleNotifications"
                class="relative w-10 h-10 rounded-full flex items-center justify-center text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-300 hover:scale-105"
              >
                <Bell class="w-5 h-5" />
                <span
                  v-if="unreadCount > 0"
                  class="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-br from-red-500 to-pink-500 text-white text-xs font-bold rounded-full flex items-center justify-center shadow-lg animate-pulse"
                >
                  {{ unreadCount > 9 ? '9+' : unreadCount }}
                </span>
              </button>

              <!-- Notification Dropdown -->
              <Transition
                enter-active-class="transition ease-out duration-200"
                enter-from-class="opacity-0 scale-95"
                enter-to-class="opacity-100 scale-100"
                leave-active-class="transition ease-in duration-150"
                leave-from-class="opacity-100 scale-100"
                leave-to-class="opacity-0 scale-95"
              >
                <div
                  v-if="isNotificationOpen"
                  class="absolute right-0 mt-2 w-96 bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 z-50 overflow-hidden"
                >
                  <!-- Header -->
                  <div class="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
                    <div class="flex items-center justify-between mb-2">
                      <h3 class="text-sm font-semibold text-gray-900 dark:text-white">
                        {{ t('notifications.title') }}
                      </h3>
                      <span
                        v-if="notifications.length > 0"
                        class="text-xs text-gray-500 dark:text-gray-400"
                      >
                        {{ notifications.length }} {{ t('notifications.total') }}
                      </span>
                    </div>
                    <div v-if="notifications.length > 0" class="flex gap-2">
                      <button
                        v-if="unreadCount > 0"
                        @click="markAllAsRead"
                        class="flex-1 px-2 py-1 text-xs text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded font-medium transition-colors"
                      >
                        {{ t('notifications.markAllRead') }}
                      </button>
                      <button
                        @click="clearAllNotifications"
                        class="flex-1 px-2 py-1 text-xs text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded font-medium transition-colors"
                      >
                        {{ t('notifications.clearAll') }}
                      </button>
                    </div>
                  </div>

                  <!-- Notifications List -->
                  <div class="max-h-96 overflow-y-auto custom-scrollbar">
                    <div
                      v-for="notification in notifications"
                      :key="notification.id"
                      @click="handleNotificationClick(notification)"
                      :class="[
                        'px-4 py-3 border-b border-gray-100 dark:border-gray-700 cursor-pointer transition-colors hover:bg-gray-50 dark:hover:bg-gray-700/50',
                        !notification.read && 'bg-indigo-50/50 dark:bg-indigo-900/10'
                      ]"
                    >
                      <div class="flex gap-3">
                        <div class="flex-shrink-0 text-2xl">
                          {{ notification.icon }}
                        </div>
                        <div class="flex-1 min-w-0">
                          <div class="flex items-start justify-between gap-2">
                            <p class="text-sm font-semibold text-gray-900 dark:text-white">
                              {{ notification.title }}
                            </p>
                            <span
                              v-if="!notification.read"
                              class="w-2 h-2 bg-indigo-600 dark:bg-indigo-400 rounded-full flex-shrink-0 mt-1"
                            ></span>
                          </div>
                          <p class="text-xs text-gray-600 dark:text-gray-400 mt-1">
                            {{ notification.message }}
                          </p>
                          <p class="text-xs text-gray-500 dark:text-gray-500 mt-2">
                            {{ formatRelativeTime(notification.timestamp) }}
                          </p>
                        </div>
                      </div>
                    </div>

                    <!-- Empty State -->
                    <div
                      v-if="notifications.length === 0"
                      class="px-6 py-16 text-center"
                    >
                      <div class="relative inline-block mb-4">
                        <div class="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-900/30 dark:to-purple-900/30 flex items-center justify-center">
                          <Bell class="w-10 h-10 text-indigo-400 dark:text-indigo-500" />
                        </div>
                        <div class="absolute -top-1 -right-1 w-6 h-6 bg-gradient-to-br from-green-400 to-emerald-400 rounded-full flex items-center justify-center">
                          <span class="text-white text-xs font-bold">✓</span>
                        </div>
                      </div>
                      <h4 class="text-sm font-semibold text-gray-900 dark:text-white mb-1">
                        {{ t('notifications.emptyTitle') }}
                      </h4>
                      <p class="text-xs text-gray-500 dark:text-gray-400 max-w-xs mx-auto">
                        {{ t('notifications.emptyDescription') }}
                      </p>
                    </div>
                  </div>

                  <!-- Footer -->
                  <div v-if="notifications.length > 0" class="px-4 py-3 bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700">
                    <button
                      @click="openNotificationModal"
                      class="text-xs text-center text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 font-medium w-full transition-colors"
                    >
                      {{ t('notifications.viewAll') }}
                    </button>
                  </div>
                </div>
              </Transition>
            </div>

            <!-- User Avatar Dropdown -->
            <div class="relative" ref="dropdownRef">
              <!-- Avatar Circle -->
              <button
                @click="toggleDropdown"
                :class="[avatarColor, 'w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 cursor-pointer']"
              >
                {{ userInitials }}
              </button>

              <!-- Dropdown Menu -->
              <Transition
                enter-active-class="transition ease-out duration-200"
                enter-from-class="opacity-0 scale-95"
                enter-to-class="opacity-100 scale-100"
                leave-active-class="transition ease-in duration-150"
                leave-from-class="opacity-100 scale-100"
                leave-to-class="opacity-0 scale-95"
              >
                <div
                  v-if="isDropdownOpen"
                  class="absolute right-0 mt-2 w-64 bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 py-2 z-50"
                >
                  <!-- User Info -->
                  <div class="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
                    <p class="text-sm font-semibold text-gray-900 dark:text-white">
                      {{ authStore.user?.display_name }}
                    </p>
                  </div>

                  <!-- Language Switcher -->
                  <div class="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
                    <div class="flex items-center justify-between mb-2">
                      <span class="text-sm font-medium text-gray-700 dark:text-gray-300">{{ t('common.language') }}</span>
                    </div>
                    <LanguageSwitcher />
                  </div>

                  <!-- Theme Toggle -->
                  <div class="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
                    <div class="flex items-center justify-between mb-2">
                      <span class="text-sm font-medium text-gray-700 dark:text-gray-300">{{ t('common.theme') }}</span>
                    </div>
                    <ThemeToggle />
                  </div>

                  <!-- Logout Button -->
                  <div class="px-2 py-2">
                    <button
                      @click="handleLogout"
                      class="w-full flex items-center gap-3 px-3 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                    >
                      <LogOut class="w-4 h-4" />
                      {{ t('common.logout') }}
                    </button>
                  </div>
                </div>
              </Transition>
            </div>
          </template>

          <!-- Guest Menu -->
          <template v-else>
            <BaseButton variant="outline" size="sm" @click="handleLogin">
              {{ t('common.login') }}
            </BaseButton>
            <BaseButton variant="primary" size="sm" @click="handleSignup">
              {{ t('common.signUp') }}
            </BaseButton>
          </template>
        </div>

        <!-- Mobile Menu Button (visible on mobile only) -->
        <button
          @click="toggleMobileMenu"
          class="sm:hidden p-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        >
          <Menu v-if="!isMobileMenuOpen" class="w-6 h-6" />
          <X v-else class="w-6 h-6" />
        </button>
      </div>

      <!-- Mobile Menu (visible on mobile when open) -->
      <Transition
        enter-active-class="transition-all ease-out duration-700"
        enter-from-class="opacity-0 max-h-0 -translate-y-4"
        enter-to-class="opacity-100 max-h-96 translate-y-0"
        leave-active-class="transition-all ease-in-out duration-700"
        leave-from-class="opacity-100 max-h-96 translate-y-0"
        leave-to-class="opacity-0 max-h-0 -translate-y-4"
      >
        <div v-if="isMobileMenuOpen" class="sm:hidden overflow-hidden">
          <div class="mt-4 pb-4 border-t border-gray-200 dark:border-gray-700 pt-4">
          <div class="flex flex-col gap-4">
            <!-- Language and Theme Controls -->
            <div class="flex items-center justify-between">
              <span class="text-sm text-gray-700 dark:text-gray-300">{{ t('common.language') }}</span>
              <LanguageSwitcher />
            </div>
            <div class="flex items-center justify-between">
              <span class="text-sm text-gray-700 dark:text-gray-300">{{ t('common.theme') }}</span>
              <ThemeToggle />
            </div>

            <div class="border-t border-gray-200 dark:border-gray-700 my-2"></div>

            <!-- Authenticated User Menu -->
            <template v-if="authStore.isAuthenticated">
              <div class="flex flex-col gap-3">
                <!-- User Info -->
                <div class="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div class="flex items-center gap-3">
                    <div :class="[avatarColor, 'w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-lg']">
                      {{ userInitials }}
                    </div>
                    <div>
                      <p class="text-sm font-semibold text-gray-900 dark:text-white">
                        {{ authStore.user?.display_name }}
                      </p>
                    </div>
                  </div>
                </div>

                <!-- Notifications -->
                <div class="rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
                  <div class="px-3 py-2 bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
                    <div class="flex items-center justify-between mb-2">
                      <div class="flex items-center gap-2">
                        <Bell class="w-4 h-4 text-gray-700 dark:text-gray-300" />
                        <span class="text-xs font-semibold text-gray-900 dark:text-white">{{ t('notifications.title') }}</span>
                      </div>
                      <span
                        v-if="unreadCount > 0"
                        class="px-2 py-0.5 bg-gradient-to-br from-red-500 to-pink-500 text-white text-xs font-bold rounded-full"
                      >
                        {{ unreadCount }}
                      </span>
                    </div>
                    <div v-if="notifications.length > 0" class="flex gap-2">
                      <button
                        v-if="unreadCount > 0"
                        @click="markAllAsRead"
                        class="flex-1 px-2 py-1 text-xs text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded font-medium transition-colors"
                      >
                        {{ t('notifications.markAllRead') }}
                      </button>
                      <button
                        @click="clearAllNotifications"
                        class="flex-1 px-2 py-1 text-xs text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded font-medium transition-colors"
                      >
                        {{ t('notifications.clearAll') }}
                      </button>
                    </div>
                  </div>

                  <!-- Mobile Notifications List -->
                  <div v-if="notifications.length > 0" class="max-h-64 overflow-y-auto custom-scrollbar">
                    <div
                      v-for="notification in notifications.slice(0, 3)"
                      :key="notification.id"
                      @click="handleNotificationClick(notification)"
                      :class="[
                        'px-3 py-2 border-b border-gray-100 dark:border-gray-700 last:border-b-0 cursor-pointer transition-colors',
                        !notification.read && 'bg-indigo-50/50 dark:bg-indigo-900/10'
                      ]"
                    >
                      <div class="flex gap-2">
                        <div class="flex-shrink-0 text-lg">
                          {{ notification.icon }}
                        </div>
                        <div class="flex-1 min-w-0">
                          <p class="text-xs font-semibold text-gray-900 dark:text-white">
                            {{ notification.title }}
                          </p>
                          <p class="text-xs text-gray-600 dark:text-gray-400 mt-0.5 line-clamp-1">
                            {{ notification.message }}
                          </p>
                          <p class="text-xs text-gray-500 dark:text-gray-500 mt-1">
                            {{ formatRelativeTime(notification.timestamp) }}
                          </p>
                        </div>
                        <span
                          v-if="!notification.read"
                          class="w-2 h-2 bg-indigo-600 dark:bg-indigo-400 rounded-full flex-shrink-0 mt-1"
                        ></span>
                      </div>
                    </div>
                  </div>

                  <!-- Mobile Empty State -->
                  <div v-else class="px-4 py-8 text-center">
                    <div class="relative inline-block mb-3">
                      <div class="w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-900/30 dark:to-purple-900/30 flex items-center justify-center">
                        <Bell class="w-8 h-8 text-indigo-400 dark:text-indigo-500" />
                      </div>
                      <div class="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-br from-green-400 to-emerald-400 rounded-full flex items-center justify-center">
                        <span class="text-white text-xs font-bold">✓</span>
                      </div>
                    </div>
                    <h4 class="text-xs font-semibold text-gray-900 dark:text-white mb-1">
                      {{ t('notifications.emptyTitle') }}
                    </h4>
                    <p class="text-xs text-gray-500 dark:text-gray-400">
                      {{ t('notifications.emptyDescriptionShort') }}
                    </p>
                  </div>
                </div>

                <!-- Logout Button -->
                <button
                  @click="handleLogout"
                  class="flex items-center gap-3 px-3 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors w-full"
                >
                  <LogOut class="w-4 h-4" />
                  {{ t('common.logout') }}
                </button>
              </div>
            </template>

            <!-- Guest Menu -->
            <template v-else>
              <div class="flex flex-col gap-3">
                <BaseButton variant="outline" size="sm" @click="handleLogin" class="w-full">
                  {{ t('common.login') }}
                </BaseButton>
                <BaseButton variant="primary" size="sm" @click="handleSignup" class="w-full">
                  {{ t('common.signUp') }}
                </BaseButton>
              </div>
            </template>
          </div>
          </div>
        </div>
      </Transition>
    </div>
  </header>

  <!-- Notification Modal -->
  <BaseModal v-model="isNotificationModalOpen" max-width="2xl">
    <!-- Modal Header -->
    <template #header>
      <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20">
        <div class="flex items-center gap-3 mb-3">
          <div class="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center">
            <Bell class="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 class="text-xl font-bold text-gray-900 dark:text-white">
              {{ t('notifications.title') }}
            </h2>
            <p class="text-xs text-gray-500 dark:text-gray-400">
              {{ notifications.length }} {{ t('notifications.total') }}
              <span v-if="unreadCount > 0" class="ml-1">• {{ unreadCount }} {{ t('notifications.unread') }}</span>
            </p>
          </div>
        </div>

        <!-- Action Buttons -->
        <div v-if="notifications.length > 0" class="flex gap-2">
          <button
            v-if="unreadCount > 0"
            @click="markAllAsRead"
            class="flex-1 px-4 py-2 text-sm text-indigo-600 dark:text-indigo-400 bg-white dark:bg-gray-800 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 rounded-xl font-semibold transition-colors border border-indigo-200 dark:border-indigo-700"
          >
            {{ t('notifications.markAllRead') }}
          </button>
          <button
            @click="clearAllNotifications"
            class="flex-1 px-4 py-2 text-sm text-red-600 dark:text-red-400 bg-white dark:bg-gray-800 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-xl font-semibold transition-colors border border-red-200 dark:border-red-700"
          >
            {{ t('notifications.clearAll') }}
          </button>
        </div>
      </div>
    </template>

    <!-- Modal Body - Notifications List -->
    <div v-if="notifications.length > 0">
      <div
        v-for="notification in notifications"
        :key="notification.id"
        @click="handleNotificationClick(notification)"
        :class="[
          'px-6 py-4 border-b border-gray-100 dark:border-gray-700 cursor-pointer transition-all hover:bg-gray-50 dark:hover:bg-gray-700/50',
          !notification.read && 'bg-indigo-50/50 dark:bg-indigo-900/10 border-l-4 border-l-indigo-500'
        ]"
      >
        <div class="flex gap-4">
          <div class="flex-shrink-0 text-3xl">
            {{ notification.icon }}
          </div>
          <div class="flex-1 min-w-0">
            <div class="flex items-start justify-between gap-3 mb-1">
              <h3 class="text-sm font-bold text-gray-900 dark:text-white">
                {{ notification.title }}
              </h3>
              <span
                v-if="!notification.read"
                class="flex-shrink-0 w-2.5 h-2.5 bg-indigo-600 dark:bg-indigo-400 rounded-full mt-1"
              ></span>
            </div>
            <p class="text-sm text-gray-600 dark:text-gray-400 mb-2">
              {{ notification.message }}
            </p>
            <div class="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-500">
              <span>{{ formatRelativeTime(notification.timestamp) }}</span>
              <span
                v-if="notification.type === 'success'"
                class="px-2 py-0.5 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-full font-medium"
              >
                {{ t('notifications.badges.success') }}
              </span>
              <span
                v-else
                class="px-2 py-0.5 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded-full font-medium"
              >
                {{ t('notifications.badges.info') }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else class="px-6 py-20 text-center">
      <div class="relative inline-block mb-6">
        <div class="w-24 h-24 mx-auto rounded-full bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-900/30 dark:to-purple-900/30 flex items-center justify-center">
          <Bell class="w-12 h-12 text-indigo-400 dark:text-indigo-500" />
        </div>
        <div class="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-br from-green-400 to-emerald-400 rounded-full flex items-center justify-center shadow-lg">
          <span class="text-white text-sm font-bold">✓</span>
        </div>
      </div>
      <h3 class="text-lg font-bold text-gray-900 dark:text-white mb-2">
        {{ t('notifications.emptyTitle') }}
      </h3>
      <p class="text-sm text-gray-500 dark:text-gray-400 max-w-sm mx-auto">
        {{ t('notifications.emptyDescription') }}
      </p>
    </div>

    <!-- Modal Footer -->
    <template #footer>
      <div v-if="notifications.length > 0" class="px-6 py-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
        <p class="text-xs text-center text-gray-500 dark:text-gray-400">
          {{ notifications.length === 1 ? t('notifications.showingAll', { count: notifications.length }) : t('notifications.showingAllPlural', { count: notifications.length }) }}
        </p>
      </div>
    </template>
  </BaseModal>
</template>

<style scoped>
.line-clamp-1 {
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* Custom scrollbar styling for notifications */
.custom-scrollbar {
  scrollbar-width: thin;
  scrollbar-color: rgba(99, 102, 241, 0.5) transparent;
}

.custom-scrollbar::-webkit-scrollbar {
  width: 8px;
}

.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background-color: rgba(99, 102, 241, 0.5);
  border-radius: 10px;
  transition: background-color 0.3s ease;
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background-color: rgba(99, 102, 241, 0.7);
}

/* Hide scrollbar arrows */
.custom-scrollbar::-webkit-scrollbar-button {
  display: none;
}

/* Dark mode scrollbar */
@media (prefers-color-scheme: dark) {
  .custom-scrollbar {
    scrollbar-color: rgba(139, 92, 246, 0.6) transparent;
  }

  .custom-scrollbar::-webkit-scrollbar-thumb {
    background-color: rgba(139, 92, 246, 0.6);
  }

  .custom-scrollbar::-webkit-scrollbar-thumb:hover {
    background-color: rgba(139, 92, 246, 0.8);
  }
}
</style>
