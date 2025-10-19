export interface User {
  id: string
  name: string
  email: string
}

export interface LoginRequest {
  email: string
  password: string
}

export interface RegisterRequest {
  name: string
  email: string
  password: string
}

export interface AuthResponse {
  user: User
  token: string
}

export interface LoginResponse {
  data: {
    access_token: string
    access_token_type: string
    display_name: string
    email: string
    id: string
  }
}
