<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { LogOut, LayoutDashboard, Menu, X } from 'lucide-vue-next'
import { useAuthStore } from '@/stores/auth'
import { useAuth } from '@/composables/useAuth'
import ThemeToggle from '../ui/ThemeToggle.vue'
import LanguageSwitcher from '../ui/LanguageSwitcher.vue'
import BaseButton from '../ui/BaseButton.vue'

const router = useRouter()
const authStore = useAuthStore()
const { logout } = useAuth()
const { t } = useI18n()
const isMobileMenuOpen = ref(false)

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
}

const goToDashboard = () => {
  router.push('/dashboard')
  isMobileMenuOpen.value = false
}

const toggleMobileMenu = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value
}
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
          <LanguageSwitcher />
          <ThemeToggle />
          <div class="border-l border-gray-300 dark:border-gray-600 h-8 mx-1"></div>

          <!-- Authenticated User Menu -->
          <template v-if="authStore.isAuthenticated">
            <div class="flex items-center gap-3">
              <span class="text-sm text-gray-700 dark:text-gray-300 hidden sm:block">
                {{ authStore.user?.display_name }}
              </span>
              <BaseButton variant="ghost" size="sm" @click="goToDashboard">
                <LayoutDashboard class="w-4 h-4" />
              </BaseButton>
              <BaseButton variant="outline" size="sm" @click="handleLogout">
                <LogOut class="w-4 h-4 mr-2" />
                {{ t('common.logout') }}
              </BaseButton>
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
                <div class="text-sm text-gray-700 dark:text-gray-300 font-medium">
                  {{ authStore.user?.display_name }}
                </div>
                <BaseButton variant="ghost" size="sm" @click="goToDashboard" class="w-full justify-start">
                  <LayoutDashboard class="w-4 h-4 mr-2" />
                  {{ t('common.dashboard') }}
                </BaseButton>
                <BaseButton variant="outline" size="sm" @click="handleLogout" class="w-full justify-start">
                  <LogOut class="w-4 h-4 mr-2" />
                  {{ t('common.logout') }}
                </BaseButton>
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
</template>

<style scoped>

</style>
