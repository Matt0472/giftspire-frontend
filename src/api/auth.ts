import apiClient from '@/config/api'
import type { User, LoginRequest, RegisterRequest, AuthResponse, LoginResponse } from '@/types/auth'

export const authAPI = {
  async login(data: LoginRequest): Promise<AuthResponse> {
    const response = await apiClient.post<LoginResponse>('/auth/login', data)

    // Map backend response to frontend format
    return {
      user: {
        id: response.data.data.id,
        name: response.data.data.display_name,
        email: response.data.data.email
      },
      token: response.data.data.access_token
    }
  },

  async register(data: RegisterRequest): Promise<AuthResponse> {
    const response = await apiClient.post<LoginResponse>('/auth/register', data)

    // Map backend response to frontend format
    return {
      user: {
        id: response.data.data.id,
        name: response.data.data.display_name,
        email: response.data.data.email
      },
      token: response.data.data.access_token
    }
  },

  async getCurrentUser(): Promise<User> {
    const response = await apiClient.get<User>('/auth/me')
    return response.data
  },

  async logout(): Promise<void> {
    await apiClient.post('/auth/logout')
  }
}
