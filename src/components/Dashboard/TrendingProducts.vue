<script setup lang="ts">
import { ref, onMounted } from 'vue'
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

const props = withDefaults(defineProps<TrendingProductsProps>(), {
  category: 'tech',
  limit: 4,
  title: 'Trending Products',
  animationDelay: 0,
  gradientVariant: 'variant1'
})

const emit = defineEmits<{
  loaded: []
}>()

const { t } = useI18n()
const products = ref<TrendingProduct[]>([])
const loading = ref(true)
const error = ref<string | null>(null)

const formatPrice = (price: number, currency: string) => {
  return new Intl.NumberFormat(undefined, {
    style: 'currency',
    currency: currency
  }).format(price)
}

const formatRating = (rating: number | null | undefined) => {
  if (rating === null || rating === undefined) {
    return 'N/A'
  }
  return rating.toFixed(1)
}

onMounted(async () => {
  try {
    console.log('[TrendingProducts] Fetching trending products for category:', props.category)
    const response = await giftSearchAPI.getTrending(props.category, props.limit)

    console.log('[TrendingProducts] Response:', response)

    products.value = response.data.products
    loading.value = false
    emit('loaded')
  } catch (e: unknown) {
    console.error('[TrendingProducts] Error fetching trending products:', e)
    error.value = 'Failed to load trending products'
    loading.value = false
    emit('loaded')
  }
})
</script>

<template>
  <Transition name="fade-slide">
    <div v-if="!loading && products.length > 0" class="mt-8" :style="{ animationDelay: `${animationDelay}ms` }">
      <h2 class="text-xl font-bold mb-4 gradient-text-animated" :class="`gradient-${gradientVariant}`">
        {{ title }}
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
              <span class="text-lg font-bold text-gray-900 dark:text-white">
                {{ formatPrice(product.price, product.currency) }}
              </span>
              <span v-if="product.is_prime" class="text-xs font-semibold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 px-2 py-1 rounded">
                Prime
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
                ({{ product.review_count.toLocaleString() }} reviews)
              </span>
            </div>
          </div>
        </template>
      </BaseCard>
      </div>
    </div>
  </Transition>
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

/* Using the same pattern as .gradient-text from main.css */
.gradient-text-animated {
  background-size: 300% auto;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  color: transparent;
  animation: gradient-shift 6s ease-in-out infinite;
  display: inline-block;
}

/* Gradient Variant 1 - Blue/Cyan/Purple */
.gradient-variant1 {
  background: linear-gradient(90deg, #3b82f6, #06b6d4, #8b5cf6, #3b82f6, #06b6d4);
}

/* Gradient Variant 2 - Pink/Purple/Rose */
.gradient-variant2 {
  background: linear-gradient(90deg, #ec4899, #a855f7, #f43f5e, #ec4899, #a855f7);
}

/* Gradient Variant 3 - Orange/Red/Amber */
.gradient-variant3 {
  background: linear-gradient(90deg, #f59e0b, #ef4444, #f97316, #f59e0b, #ef4444);
}

/* Gradient Variant 4 - Green/Teal/Emerald */
.gradient-variant4 {
  background: linear-gradient(90deg, #10b981, #14b8a6, #22c55e, #10b981, #14b8a6);
}

/* Gradient Variant 5 - Amber/Yellow/Orange */
.gradient-variant5 {
  background: linear-gradient(90deg, #d97706, #eab308, #f59e0b, #d97706, #eab308);
}

@keyframes gradient-shift {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}

@media (prefers-reduced-motion: reduce) {
  .gradient-text-animated {
    animation-duration: 0.001s;
    animation-iteration-count: 1;
  }
}
</style>
