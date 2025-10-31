import apiClient from '@/config/api'
import type { GiftSearchRequest, GiftSearchResponse, GiftSearchErrorResponse, TrendingProductsResponse } from '@/types/giftSearch'

export const giftSearchAPI = {
  /**
   * Search for gift recommendations
   * Backend returns: 201 Created with { "message": "..." }
   * The actual search is processed asynchronously via a job
   */
  async search(data: GiftSearchRequest): Promise<{ message: string }> {
    const response = await apiClient.post<{ message: string }>('/gift-finder/search', data)
    return response.data
  },

  /**
   * Get trending products for a category
   */
  async getTrending(category: string, limit: number = 10): Promise<TrendingProductsResponse> {
    const response = await apiClient.get<TrendingProductsResponse>(`/gift-finder/trending/${category}`, {
      params: { limit }
    })
    return response.data
  },

  /**
   * Get available search categories
   */
  async getCategories(): Promise<{
    categories: Record<string, string>
    relations: string[]
    occasions: string[]
  }> {
    const response = await apiClient.get('/gift-finder/categories')
    return response.data.data
  },

  /**
   * Get search suggestions based on partial input
   */
  async getSuggestions(query: string, type: 'interest' | 'relation' | 'occasion'): Promise<string[]> {
    const response = await apiClient.get<{ data: { suggestions: string[] } }>('/gift-finder/suggestions', {
      params: { query, type }
    })
    return response.data.data.suggestions
  }
}
