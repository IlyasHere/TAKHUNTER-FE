type RegisterPayload = {
  name: string
  email: string
  password: string
  role: 'MAHASISWA' | 'EVENT_ORGANIZER'
  nim?: string
}

type LoginPayload = {
  email: string
  password: string
}

type UserResponse = {
  id: number
  name: string
  email: string
  role: string
}

type AuthResponse = {
  message: string
  token: string
  user: UserResponse
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

const buildUrl = (path: string) => {
  const normalizedBaseUrl = API_BASE_URL?.replace(/\/$/, '') || ''
  const normalizedPath = path.startsWith('/') ? path : `/${path}`

  return `${normalizedBaseUrl}${normalizedPath}`
}

const parseResponse = async <T>(response: Response, fallbackMessage: string): Promise<T> => {
  const data = await response.json().catch(() => null)

  if (!response.ok) {
    throw new Error(data?.message || fallbackMessage)
  }

  return data as T
}

export const registerUser = async (payload: RegisterPayload): Promise<AuthResponse> => {
  const response = await fetch(buildUrl('/api/auth/register'), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  })

  return parseResponse<AuthResponse>(response, 'Registrasi gagal. Silakan coba lagi.')
}

export const loginUser = async (payload: LoginPayload): Promise<AuthResponse> => {
  const response = await fetch(buildUrl('/api/auth/login'), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  })

  return parseResponse<AuthResponse>(response, 'Login gagal. Periksa email dan password.')
}

export const checkAuth = async (token: string): Promise<UserResponse> => {
  const response = await fetch(buildUrl('/api/auth/check'), {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  return parseResponse<UserResponse>(response, 'Sesi tidak valid. Silakan login kembali.')
}
