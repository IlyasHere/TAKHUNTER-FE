import { buildApiUrl } from '../lib/api'

const getStoredToken = () => {
  const rawToken = localStorage.getItem('token') || localStorage.getItem('accessToken') || ''
  const token = rawToken.trim().replace(/^"|"$/g, '')

  return token.startsWith('Bearer ') ? token.substring(7).trim() : token
}

const getAuthHeaders = () => {
  const token = getStoredToken()

  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  }
}

const parseResponse = async (response, fallbackMessage) => {
  const rawBody = await response.text().catch(() => '')
  let data = null

  try {
    data = rawBody ? JSON.parse(rawBody) : null
  } catch {
    data = rawBody
  }

  if (!response.ok) {
    throw new Error(data?.message || data?.error || data || fallbackMessage)
  }

  return data
}

const normalizeList = (data) => {
  if (Array.isArray(data)) return data
  if (Array.isArray(data?.data)) return data.data
  if (Array.isArray(data?.content)) return data.content
  if (Array.isArray(data?.bookmarks)) return data.bookmarks

  return []
}

export const getBookmarkList = async () => {
  const response = await fetch(buildApiUrl('/api/bookmark'), {
    method: 'GET',
    headers: getAuthHeaders(),
  })

  const data = await parseResponse(response, 'Gagal mengambil bookmark.')
  return normalizeList(data)
}

export const getBookmarkIds = async () => {
  const response = await fetch(buildApiUrl('/api/bookmark/ids'), {
    method: 'GET',
    headers: getAuthHeaders(),
  })

  const data = await parseResponse(response, 'Gagal mengambil status bookmark.')
  return normalizeList(data)
}

export const addBookmark = async (kegiatanId) => {
  const response = await fetch(buildApiUrl(`/api/bookmark/${kegiatanId}`), {
    method: 'POST',
    headers: getAuthHeaders(),
  })

  return parseResponse(response, 'Gagal menyimpan bookmark.')
}

export const removeBookmark = async (kegiatanId) => {
  const response = await fetch(buildApiUrl(`/api/bookmark/${kegiatanId}`), {
    method: 'DELETE',
    headers: getAuthHeaders(),
  })

  return parseResponse(response, 'Gagal menghapus bookmark.')
}
