import apiClient from '@/config/api'
import type { GiftSearchRequest, GiftSearchResponse, GiftSearchErrorResponse, TrendingProductsResponse, SearchHistoryResponse, SearchHistoryItem, PendingOrdersResponse } from '@/types/giftSearch'

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
  },

  /**
   * Get search results by search ID
   */
  async getSearchResults(searchId: string): Promise<SearchHistoryItem> {
    const response = await apiClient.get<SearchHistoryItem>(`/gift-finder/searches/${searchId}`)
    return response.data
  },

  /**
   * Get all search history for the authenticated user (paginated)
   */
  async getSearchHistory(page: number = 1, perPage: number = 9): Promise<SearchHistoryResponse> {
    const response = await apiClient.get<SearchHistoryResponse>('/gift-finder/searches', {
      params: { page, per_page: perPage }
    })
    return response.data
  },

  /**
   * Get all pending orders for the authenticated user (paginated)
   */
  async getPendingOrders(page: number = 1, perPage: number = 12): Promise<PendingOrdersResponse> {
    const response = await apiClient.get<PendingOrdersResponse>('/gift-finder/pending-orders', {
      params: { page, per_page: perPage }
    })
    return response.data
  },

  /**
   * Delete a pending order by ID
   */
  async deletePendingOrder(orderId: number): Promise<{ message: string }> {
    const response = await apiClient.delete<{ message: string }>(`/gift-finder/pending-orders/${orderId}`)
    return response.data
  }
}
