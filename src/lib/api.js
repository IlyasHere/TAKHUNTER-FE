export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080'

export const buildApiUrl = (path) => {
  const normalizedBaseUrl = API_BASE_URL?.replace(/\/$/, '') || ''
  const normalizedPath = path.startsWith('/') ? path : `/${path}`

  return `${normalizedBaseUrl}${normalizedPath}`
}
