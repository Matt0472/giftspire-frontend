export interface User {
  id: string
  display_name: string
}

export interface LoginRequest {
  nickname: string
  password: string
  remember_me?: boolean
}

export interface RegisterRequest {
  nickname: string
  password: string
  password_confirmation: string
  terms: boolean
}

// Backend login response: returns access_token and token_expires_at
export interface LoginResponse {
  access_token: string
  token_expires_at: string | null
}

// Backend /api/init response: returns user data
export interface UserResponse {
  id: string
  display_name: string
}

// Backend check nickname response
export interface CheckNicknameResponse {
  available: boolean
}
