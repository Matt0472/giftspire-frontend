export type Relation =
  | 'girlfriend'
  | 'boyfriend'
  | 'wife'
  | 'husband'
  | 'mother'
  | 'father'
  | 'friend'
  | 'colleague'
  | 'brother'
  | 'sister'
  | 'daughter'
  | 'son'
  | 'boss'
  | 'coworker'
  | 'neighbor'
  | 'teacher'
  | 'student'

export type Occasion =
  | 'birthday'
  | 'christmas'
  | 'valentine'
  | 'anniversary'
  | 'graduation'
  | 'wedding'
  | 'mothers_day'
  | 'fathers_day'
  | 'housewarming'
  | 'baby_shower'
  | 'retirement'
  | 'promotion'
  | 'just_because'

export type AgeGroup = 'child' | 'teenager' | 'young_adult' | 'adult' | 'middle_aged' | 'senior'

export type Gender = 'male' | 'female' | 'non_binary' | 'prefer_not_to_say'

export interface GiftSearchRequest {
  relation: Relation
  occasion: Occasion
  min_budget: number
  max_budget: number
  interests: string[]
  age_group?: AgeGroup
  gender?: Gender
  max_results?: number
  output_language?: string
}

export interface GiftProduct {
  asin: string
  title: string
  url: string
  image: string
  price: number
  currency: string
  rating: number
  review_count: number
  features: string[]
  is_prime: boolean
  ai_reasoning: string
  ai_personalized_description: string
  ai_personalized_title: string
}

export interface GiftSearchContext {
  relation: string
  occasion: string
  budget: {
    min: number
    max: number
  }
  interests: string[]
}

export interface GiftSearchMetadata {
  total_products_searched: number
  products_after_filtering: number
  search_strategies_used: number
}

export interface GiftSearchResponse {
  success: boolean
  data: {
    recommendations: GiftProduct[]
    context: GiftSearchContext
    metadata: GiftSearchMetadata
  }
}

export interface GiftSearchErrorResponse {
  success: false
  message: string
  errors?: Record<string, string[]>
}

export interface TrendingProduct {
  asin: string
  title: string
  url: string
  image: string
  price: number
  currency: string
  rating: number | null
  review_count: number
  is_prime: boolean
}

export interface TrendingProductsResponse {
  success: boolean
  data: {
    category: string
    products: TrendingProduct[]
    total: number
  }
}

export interface SearchHistoryItem {
  id: number
  data: {
    recommendations: GiftProduct[]
    context: GiftSearchContext
    metadata: GiftSearchMetadata
  }
}

export interface PaginationLinks {
  first: string | null
  last: string | null
  prev: string | null
  next: string | null
}

export interface PaginationMeta {
  current_page: number
  from: number | null
  last_page: number
  path: string
  per_page: number
  to: number | null
  total: number
}

export interface SearchHistoryResponse {
  data: SearchHistoryItem[]
  links: PaginationLinks
  meta: PaginationMeta
}

export interface PendingOrderItem {
  id: number
  options: {
    relation: string
    occasion: string
    minBudget: number
    maxBudget: number
    interests: string[]
    ageGroup?: string
    gender?: string
    maxResults?: number
    outputLanguage?: string
  }
  created_at: string | null
  started_at: string | null
  failed_at: string | null
  error_code: string | null
  error_details: string | null
}

export interface PendingOrdersResponse {
  data: PendingOrderItem[]
  links: PaginationLinks
  meta: PaginationMeta
}
