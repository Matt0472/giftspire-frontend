<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { useI18n } from 'vue-i18n'
import BaseCard from '@/components/ui/BaseCard.vue'
import BaseSkeleton from '@/components/ui/BaseSkeleton.vue'
import { giftSearchAPI } from '@/api/giftSearch'
import type { TrendingProduct } from '@/types/giftSearch'

export type GradientVariant = 'variant1' | 'variant2' | 'variant3' | 'variant4' | 'variant5'

interface TrendingProductsProps {
  category?: string
  limit?: number
  title?: string
  animationDelay?: number
  gradientVariant?: GradientVariant
}

const { t } = useI18n()

const props = withDefaults(defineProps<TrendingProductsProps>(), {
  category: 'tech',
  limit: 4,
  animationDelay: 0,
  gradientVariant: 'variant1'
})

const products = ref<TrendingProduct[]>([])
const loading = ref(true)
const error = ref<string | null>(null)
const isMounted = ref(true)

const formatPrice = (price: number, currency: string | null | undefined) => {
  // Default to USD if currency is null or invalid
  const validCurrency = currency || 'USD'

  try {
    return new Intl.NumberFormat(undefined, {
      style: 'currency',
      currency: validCurrency
    }).format(price)
  } catch (e) {
    // Fallback if currency code is still invalid
    return `${validCurrency} ${price.toFixed(2)}`
  }
}

const formatRating = (rating: number | null | undefined) => {
  if (rating === null || rating === undefined) {
    return t('dashboard.trending.ratingNotAvailable')
  }
  return rating.toFixed(1)
}

onMounted(async () => {
  try {
    console.log('[TrendingProducts] Fetching trending products for category:', props.category)
    const response = await giftSearchAPI.getTrending(props.category, props.limit)

    console.log('[TrendingProducts] Response:', response)

    // Only update if still mounted
    if (!isMounted.value) return

    products.value = response.data.products
    loading.value = false
  } catch (e: unknown) {
    console.error('[TrendingProducts] Error fetching trending products:', e)

    // Only update if still mounted - fail gracefully without breaking other components
    if (!isMounted.value) return

    error.value = t('dashboard.trending.loadError')
    loading.value = false
  }
})

onBeforeUnmount(() => {
  isMounted.value = false
})
</script>

<template>
  <div class="mt-8">
    <!-- Loading Skeleton -->
    <div v-if="loading" class="space-y-4">
      <BaseSkeleton shape="rect" inner-class="h-6 w-48" />
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <BaseSkeleton v-for="i in limit" :key="i" shape="rect" inner-class="h-64" />
      </div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="text-center py-8">
      <p class="text-sm text-gray-500 dark:text-gray-400">{{ error }}</p>
    </div>

    <!-- Products Content -->
    <Transition name="fade-slide" v-else-if="products.length > 0">
      <div>
        <h2 class="text-xl font-bold mb-4" :class="`gradient-text-${gradientVariant}`">
          {{ title || t('dashboard.trending.title') }}
        </h2>

        <!-- Products Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <BaseCard
        v-for="product in products"
        :key="product.asin"
        :title="product.title"
        :image-src="product.image"
        :image-alt="product.title"
        :href="product.url"
        target="_blank"
      >
        <template #description>
          <div class="space-y-2">
            <div class="flex items-center justify-between">
              <span class="text-lg font-bold text-white dark:text-gray-100">
                {{ formatPrice(product.price, product.currency) }}
              </span>
              <span v-if="product.is_prime" class="text-xs font-semibold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 px-2 py-1 rounded">
                {{ t('dashboard.trending.prime') }}
              </span>
            </div>
            <div v-if="product.rating !== null && product.rating !== undefined" class="flex items-center gap-2">
              <div class="flex items-center">
                <svg class="w-4 h-4 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <span class="ml-1 text-sm font-medium text-gray-700 dark:text-gray-300">
                  {{ formatRating(product.rating) }}
                </span>
              </div>
              <span class="text-xs text-gray-500 dark:text-gray-400">
                ({{ product.review_count.toLocaleString() }} {{ t('dashboard.trending.reviews') }})
              </span>
            </div>
          </div>
        </template>
      </BaseCard>
        </div>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.fade-slide-enter-active {
  animation: fadeSlideIn 0.6s ease-out forwards;
}

@keyframes fadeSlideIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

</style>
