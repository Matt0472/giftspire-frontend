<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { Sparkles } from 'lucide-vue-next'
import BaseCard from '@/components/ui/BaseCard.vue'
import { formatPrice, formatRating } from '@/utils/formatters'

interface Product {
  asin: string
  title: string
  ai_personalized_title?: string
  image?: string
  url?: string
  price?: number
  currency?: string
  is_prime?: boolean
  rating?: number
  review_count: number
  ai_personalized_description: string
  ai_reasoning: string
  features?: string[]
}

interface Props {
  product: Product
  animationDelay?: number
}

const props = withDefaults(defineProps<Props>(), {
  animationDelay: 0
})

const { t } = useI18n()
const isExpanded = ref(false)

const toggleExpand = () => {
  isExpanded.value = !isExpanded.value
}
</script>

<template>
  <div
    class="product-card-wrapper"
    :style="{ animationDelay: `${animationDelay}ms` }"
  >
    <div class="product-card">
      <BaseCard
        :image-src="product.image || ''"
        :image-alt="product.title || 'Product image'"
        :href="product.url || '#'"
        :target="product.url ? '_blank' : '_self'"
      >
        <template #title>
          {{ product.ai_personalized_title || product.title }}
        </template>

        <template #description>
          <div class="product-info">
            <!-- Price and Prime Badge -->
            <div v-if="product.price" class="price-row">
              <span class="product-price">
                {{ formatPrice(product.price, product.currency) }}
              </span>
              <span v-if="product.is_prime" class="prime-badge"> Prime </span>
            </div>

            <!-- Rating -->
            <div v-if="product.rating" class="rating-row">
              <div class="rating-stars">
                <svg class="star-icon" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
                  />
                </svg>
                <span class="rating-value">{{ formatRating(product.rating) }}</span>
              </div>
              <span class="review-count">
                ({{ product.review_count.toLocaleString() }} reviews)
              </span>
            </div>

            <!-- AI Personalized Description -->
            <div class="ai-description">
              <div class="ai-badge">
                <Sparkles class="w-3 h-3" />
                <span>{{ t('searchResults.aiPowered') }}</span>
              </div>
              <p class="description-text">{{ product.ai_personalized_description }}</p>
            </div>

            <!-- Expandable Content -->
            <div v-if="isExpanded" class="expandable-content">
              <!-- AI Reasoning -->
              <div class="ai-reasoning">
                <h4 class="reasoning-title">{{ t('searchResults.whyThisGift') }}</h4>
                <p class="reasoning-text">{{ product.ai_reasoning }}</p>
              </div>

              <!-- Features -->
              <div
                v-if="product.features && product.features.length > 0"
                class="features-list"
              >
                <h4 class="features-title">{{ t('searchResults.keyFeatures') }}</h4>
                <ul class="features">
                  <li v-for="(feature, idx) in product.features" :key="idx">
                    {{ feature }}
                  </li>
                </ul>
              </div>
            </div>

            <!-- Show More/Less Button -->
            <button @click.prevent="toggleExpand" class="show-more-button">
              {{
                isExpanded
                  ? t('searchResults.showLess')
                  : t('searchResults.showMore')
              }}
            </button>
          </div>
        </template>
      </BaseCard>
    </div>
  </div>
</template>

<style scoped>
.product-card-wrapper {
  animation: fadeInUp 0.6s ease-out both;
  display: flex;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.product-card {
  display: flex;
  flex-direction: column;
  width: 100%;
  min-height: 680px;
}

.product-card :deep(.card-wrapper) {
  display: flex;
  flex-direction: column;
  width: 100%;
}

.product-card :deep(.card-content) {
  display: flex;
  flex-direction: column;
  flex: 1;
}

.product-card :deep(.content-wrapper) {
  display: flex;
  flex-direction: column;
  flex-grow: 1;
}

.product-card :deep(.image-container) {
  flex-shrink: 0;
}

/* Product Info */
.product-info {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.price-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 0.5rem;
}

.product-price {
  font-size: 1.25rem;
  font-weight: 700;
  color: #111827;
}

.prime-badge {
  display: inline-block;
  padding: 0.25rem 0.5rem;
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
  color: white;
  font-size: 0.75rem;
  font-weight: 600;
  border-radius: 0.375rem;
  text-transform: uppercase;
  letter-spacing: 0.025em;
}

.rating-row {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.75rem;
}

.rating-stars {
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.star-icon {
  width: 1rem;
  height: 1rem;
  color: #fbbf24;
}

.rating-value {
  font-size: 0.875rem;
  font-weight: 600;
  color: #374151;
}

.review-count {
  font-size: 0.8125rem;
  color: #6b7280;
}

/* AI Description */
.ai-description {
  margin-bottom: 1rem;
  min-height: 120px;
  display: flex;
  flex-direction: column;
}

.ai-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.375rem 0.75rem;
  background: linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(168, 85, 247, 0.1) 100%);
  border-radius: 999px;
  font-size: 0.75rem;
  font-weight: 600;
  color: #6366f1;
  margin-bottom: 0.75rem;
}

.description-text {
  font-size: 0.9375rem;
  line-height: 1.6;
  color: #4b5563;
  display: -webkit-box;
  -webkit-line-clamp: 4;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* Expandable Content */
.expandable-content {
  overflow: hidden;
  animation: expandDown 0.3s ease-out forwards;
  margin-top: 0.75rem;
}

@keyframes expandDown {
  from {
    opacity: 0;
    max-height: 0;
    margin-top: 0;
  }
  to {
    opacity: 1;
    max-height: 2000px;
    margin-top: 0.75rem;
  }
}

.ai-reasoning {
  margin-bottom: 1.5rem;
  padding: 1rem;
  background: linear-gradient(135deg, rgba(99, 102, 241, 0.05) 0%, rgba(168, 85, 247, 0.05) 100%);
  border-radius: 0.75rem;
  border-left: 3px solid #6366f1;
}

.reasoning-title {
  font-size: 0.875rem;
  font-weight: 700;
  color: #6366f1;
  margin-bottom: 0.5rem;
}

.reasoning-text {
  font-size: 0.875rem;
  line-height: 1.6;
  color: #4b5563;
}

.features-list {
  margin-top: 1rem;
}

.features-title {
  font-size: 0.875rem;
  font-weight: 700;
  color: #374151;
  margin-bottom: 0.5rem;
}

.features {
  list-style: none;
  padding: 0;
  margin: 0;
}

.features li {
  font-size: 0.8125rem;
  color: #6b7280;
  padding-left: 1.25rem;
  position: relative;
  margin-bottom: 0.375rem;
}

.features li::before {
  content: '✓';
  position: absolute;
  left: 0;
  color: #10b981;
  font-weight: 700;
}

.show-more-button {
  width: 100%;
  margin-top: 1rem;
  padding: 0.625rem 1rem;
  background: linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(168, 85, 247, 0.1) 100%);
  color: #6366f1;
  font-size: 0.875rem;
  font-weight: 600;
  border: 1px solid rgba(99, 102, 241, 0.2);
  border-radius: 0.5rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

.show-more-button:hover {
  background: linear-gradient(135deg, rgba(99, 102, 241, 0.15) 0%, rgba(168, 85, 247, 0.15) 100%);
  border-color: rgba(99, 102, 241, 0.3);
  transform: translateY(-1px);
}

/* Dark Mode */
@media (prefers-color-scheme: dark) {
  .product-price {
    color: #f3f4f6;
  }

  .rating-value {
    color: #f3f4f6;
  }

  .review-count {
    color: #d1d5db;
  }

  .description-text {
    color: #d1d5db;
  }

  .reasoning-text {
    color: #d1d5db;
  }

  .features-title {
    color: #f3f4f6;
  }

  .features li {
    color: #d1d5db;
  }

  .show-more-button {
    color: #a5b4fc;
    background: linear-gradient(135deg, rgba(99, 102, 241, 0.15) 0%, rgba(168, 85, 247, 0.15) 100%);
    border-color: rgba(99, 102, 241, 0.3);
  }

  .show-more-button:hover {
    background: linear-gradient(135deg, rgba(99, 102, 241, 0.2) 0%, rgba(168, 85, 247, 0.2) 100%);
    border-color: rgba(99, 102, 241, 0.4);
  }
}
</style>
