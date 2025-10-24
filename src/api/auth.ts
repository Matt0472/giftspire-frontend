import apiClient from '@/config/api'
import type { User, LoginRequest, RegisterRequest, LoginResponse, UserResponse } from '@/types/auth'

export const authAPI = {
  /**
   * Login user and return access token
   * Backend returns: { "access_token": "..." }
   */
  async login(data: LoginRequest): Promise<string> {
    const response = await apiClient.post<LoginResponse>('/auth/login', data)
    return response.data.access_token
  },

  /**
   * Register a new user
   * Backend returns: 204 No Content
   */
  async register(data: RegisterRequest): Promise<void> {
    await apiClient.post('/auth/register', data)
  },

  /**
   * Get current authenticated user
   * Backend returns: { "id": "...", "display_name": "...", "email": "..." }
   */
  async getCurrentUser(): Promise<User> {
    const response = await apiClient.get<UserResponse>('/init')

    // Map backend response to frontend User type
    return {
      id: response.data.id,
      name: response.data.display_name,
      email: response.data.email
    }
  },

  async logout(): Promise<void> {
    await apiClient.post('/auth/logout')
  },

  /**
   * Resend email verification notification (authenticated users)
   * Backend returns: 204 No Content
   */
  async resendVerificationEmail(): Promise<void> {
    await apiClient.post('/auth/send_verification_email')
  },

  /**
   * Resend email verification by email address (unauthenticated users)
   * Backend returns: 204 No Content
   */
  async resendVerificationEmailByEmail(email: string): Promise<void> {
    await apiClient.post('/auth/resend_verification_email', { email })
  }
}
