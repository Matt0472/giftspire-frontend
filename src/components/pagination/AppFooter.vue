<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { Instagram } from 'lucide-vue-next'

const { t } = useI18n()
const currentYear = computed(() => new Date().getFullYear())
</script>

<template>
  <footer class="bg-white dark:bg-gray-900 text-gray-900 dark:text-white shadow dark:shadow-gray-700">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Two Column Layout -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
        <!-- Left Column: Company Information -->
        <div>
          <h2 class="text-3xl font-bold text-gray-900 dark:text-white mb-4">{{ t('common.appName') }}</h2>
          <p class="text-sm text-gray-700 dark:text-white/80 leading-relaxed mb-4">{{ t('footer.aboutDescription') }}</p>

          <!-- Social Media -->
          <div class="flex items-center gap-4 mb-4">
            <a
              href="https://www.instagram.com/giftspire"
              target="_blank"
              rel="noopener noreferrer"
              class="text-gray-700 dark:text-white/80 hover:text-gray-900 dark:hover:text-white transition-colors"
              :aria-label="t('footer.followInstagram')"
            >
              <Instagram class="w-6 h-6" />
            </a>
          </div>

          <!-- Copyright -->
          <p class="text-sm text-gray-700 dark:text-white/90">{{ t('footer.copyright', [currentYear]) }}</p>
        </div>

        <!-- Right Column: Transparency Disclosure -->
        <div>
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-3">{{ t('footer.transparencyTitle') }}</h3>
          <p class="text-sm text-gray-700 dark:text-white/80 mb-2 leading-relaxed">{{ t('footer.transparencyText') }}</p>
          <p class="text-sm text-gray-700 dark:text-white/80 leading-relaxed">{{ t('footer.amazonDisclosure') }}</p>
        </div>
      </div>
    </div>
  </footer>
</template>

<style scoped>

</style>
