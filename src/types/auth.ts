export interface User {
  id: string
  name: string
  email: string
}

export interface LoginRequest {
  email: string
  password: string
  remember_me?: boolean
}

export interface RegisterRequest {
  name: string
  email: string
  password: string
}

// Backend login response: only returns access_token
export interface LoginResponse {
  access_token: string
}

// Backend /api/init response: returns user data
export interface UserResponse {
  id: string
  display_name: string
  email: string
}
