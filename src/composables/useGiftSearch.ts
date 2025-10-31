import { ref } from 'vue'
import { giftSearchAPI } from '@/api/giftSearch'
import type { GiftSearchRequest, Relation, Occasion } from '@/types/giftSearch'
import { useToastStore } from '@/stores/toast'
import { useI18n } from 'vue-i18n'

// Helper to map chip keys to API values
const chipToRelationMap: Record<string, Relation> = {
  friend: 'friend',
  mom: 'mother',
  dad: 'father',
  coworker: 'coworker',
  girlfriend: 'girlfriend',
  boyfriend: 'boyfriend',
  kids: 'son', // or 'daughter', but we'll use 'son' as default
  teacher: 'teacher'
}

const chipToOccasionMap: Record<string, Occasion> = {
  birthday: 'birthday',
  anniversary: 'anniversary',
  wedding: 'wedding',
  newBaby: 'baby_shower',
  graduation: 'graduation',
  housewarming: 'housewarming',
  christmas: 'christmas',
  valentines: 'valentine'
}

const chipToInterestsMap: Record<string, string[]> = {
  tech: ['technology', 'gadgets'],
  fashion: ['fashion', 'style'],
  beauty: ['beauty', 'self-care'],
  homeKitchen: ['home decor', 'cooking'],
  sportsOutdoors: ['sports', 'outdoors'],
  booksHobbies: ['books', 'reading'],
  foodDrink: ['food', 'wine'],
  ecoFriendly: ['eco-friendly', 'sustainable']
}

export function useGiftSearch() {
  const toast = useToastStore()
  const { locale } = useI18n()
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  /**
   * Build a gift search request from a chip key
   * This creates a basic request structure that can be customized
   */
  const buildRequestFromChip = (chipKey: string): GiftSearchRequest | null => {
    // Check if it's a relation chip
    if (chipToRelationMap[chipKey]) {
      return {
        relation: chipToRelationMap[chipKey],
        occasion: 'birthday', // Default occasion
        min_budget: 20,
        max_budget: 100,
        interests: ['general'],
        output_language: locale.value === 'it' ? 'Italian' : 'English'
      }
    }

    // Check if it's an occasion chip
    if (chipToOccasionMap[chipKey]) {
      return {
        relation: 'friend', // Default relation
        occasion: chipToOccasionMap[chipKey],
        min_budget: 20,
        max_budget: 100,
        interests: ['general'],
        output_language: locale.value === 'it' ? 'Italian' : 'English'
      }
    }

    // Check if it's an interest/category chip
    if (chipToInterestsMap[chipKey]) {
      return {
        relation: 'friend', // Default relation
        occasion: 'birthday', // Default occasion
        min_budget: 20,
        max_budget: 100,
        interests: chipToInterestsMap[chipKey],
        output_language: locale.value === 'it' ? 'Italian' : 'English'
      }
    }

    return null
  }

  /**
   * Search for gift recommendations
   */
  const search = async (data: GiftSearchRequest) => {
    isLoading.value = true
    error.value = null

    try {
      const response = await giftSearchAPI.search(data)

      console.log('[GiftSearch] Request sent:', data)
      console.log('[GiftSearch] Response:', response)

      toast.success(response.message || 'Gift search started!', 'Success')

      return response
    } catch (err: unknown) {
      const errorMessage = (err as { response?: { data?: { message?: string } } }).response?.data?.message
      const message = errorMessage || 'Failed to start gift search. Please try again.'
      error.value = message

      console.error('[GiftSearch] Error:', err)

      toast.error(message, 'Search failed')
      throw err
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Handle chip click - builds request from chip and sends it
   */
  const searchFromChip = async (chipKey: string, chipPrompt: string) => {
    console.log('[GiftSearch] Chip clicked:', chipKey, chipPrompt)

    const request = buildRequestFromChip(chipKey)

    if (!request) {
      console.warn('[GiftSearch] Could not build request from chip:', chipKey)
      toast.error('Invalid chip selection', 'Error')
      return
    }

    console.log('[GiftSearch] Built request from chip:', request)

    await search(request)
  }

  /**
   * Get trending products
   */
  const getTrending = async (category: string, limit: number = 10) => {
    isLoading.value = true
    error.value = null

    try {
      const response = await giftSearchAPI.getTrending(category, limit)
      console.log('[GiftSearch] Trending products:', response)
      return response.data.products
    } catch (err: unknown) {
      const errorMessage = (err as { response?: { data?: { message?: string } } }).response?.data?.message
      const message = errorMessage || 'Failed to get trending products.'
      error.value = message
      console.error('[GiftSearch] Error getting trending:', err)
      throw err
    } finally {
      isLoading.value = false
    }
  }

  return {
    // State
    isLoading,
    error,

    // Actions
    search,
    searchFromChip,
    getTrending,
    buildRequestFromChip
  }
}
