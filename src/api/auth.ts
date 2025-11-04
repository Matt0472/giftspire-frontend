import apiClient from '@/config/api'
import type { User, LoginRequest, RegisterRequest, LoginResponse, UserResponse, CheckNicknameResponse } from '@/types/auth'

export const authAPI = {
  /**
   * Check if a nickname is available for registration
   * Backend returns: { "available": true|false }
   */
  async checkNickname(nickname: string): Promise<boolean> {
    const response = await apiClient.post<CheckNicknameResponse>('/auth/check-nickname', { nickname })
    return response.data.available
  },

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
   * Backend returns: { "id": "...", "display_name": "..." }
   */
  async getCurrentUser(): Promise<User> {
    const response = await apiClient.get<UserResponse>('/init')

    return {
      id: response.data.id,
      display_name: response.data.display_name
    }
  },

  async logout(): Promise<void> {
    await apiClient.post('/auth/logout')
  },

  /**
   * Update user password
   * Backend expects: { "old_password": "...", "new_password": "..." }
   * Backend returns: 204 No Content
   */
  async updatePassword(oldPassword: string, newPassword: string): Promise<void> {
    await apiClient.put('/user/password', {
      old_password: oldPassword,
      new_password: newPassword
    })
  },

  /**
   * Delete user account
   * Backend expects: { "password": "..." }
   * Backend returns: 204 No Content
   */
  async deleteAccount(password: string): Promise<void> {
    await apiClient.delete('/user/account', {
      data: { password }
    })
  }
}
