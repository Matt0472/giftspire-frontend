<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { LogOut, LayoutDashboard } from 'lucide-vue-next'
import { useAuthStore } from '@/stores/auth'
import { useAuth } from '@/composables/useAuth'
import ThemeToggle from '../ui/ThemeToggle.vue'
import LanguageSwitcher from '../ui/LanguageSwitcher.vue'
import BaseButton from '../ui/BaseButton.vue'

const router = useRouter()
const authStore = useAuthStore()
const { logout } = useAuth()
const { t } = useI18n()

const handleLogin = () => {
  router.push('/login')
}

const handleSignup = () => {
  router.push('/register')
}

const handleLogout = async () => {
  await logout()
}

const goToDashboard = () => {
  router.push('/dashboard')
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

        <div class="flex items-center gap-3">
          <LanguageSwitcher />
          <ThemeToggle />
          <div class="border-l border-gray-300 dark:border-gray-600 h-8 mx-1"></div>

          <!-- Authenticated User Menu -->
          <template v-if="authStore.isAuthenticated">
            <div class="flex items-center gap-3">
              <span class="text-sm text-gray-700 dark:text-gray-300 hidden sm:block">
                {{ authStore.user?.name }}
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
      </div>
    </div>
  </header>
</template>

<style scoped>

</style>
