import { buildApiUrl } from '../lib/api'

export class ApiRequestError extends Error {
  constructor(message) {
    super(message)
    this.name = 'ApiRequestError'
  }
}

const getStoredToken = () => {
  const rawToken = localStorage.getItem('token') || localStorage.getItem('accessToken') || ''
  const token = rawToken.trim().replace(/^"|"$/g, '')

  return token.startsWith('Bearer ') ? token.substring(7).trim() : token
}

const getAuthHeaders = ({ json = true } = {}) => {
  const token = getStoredToken()

  return {
    ...(json ? { 'Content-Type': 'application/json' } : {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  }
}

const parseResponse = async (response, fallbackMessage, requestInfo = {}) => {
  const rawBody = await response.text().catch(() => '')
  let data = null

  try {
    data = rawBody ? JSON.parse(rawBody) : null
  } catch {
    data = null
  }

  if (!response.ok) {
    const error = new ApiRequestError(
      data?.message ||
        data?.error ||
        `[${requestInfo.method || 'REQUEST'} ${requestInfo.url || response.url} -> ${response.status}] ${fallbackMessage}`,
    )

    error.status = response.status
    error.statusText = response.statusText
    error.url = requestInfo.url || response.url
    error.method = requestInfo.method
    error.responseBody = data || rawBody
    error.hasToken = requestInfo.hasToken
    error.tokenPreview = requestInfo.tokenPreview

    console.groupCollapsed(
      `[TAK Hub API Error] ${error.method || 'REQUEST'} ${error.url || response.url} -> ${response.status}`,
    )
    console.log('status:', response.status, response.statusText)
    console.log('response:', data || rawBody || '(empty response body)')
    console.groupEnd()

    throw error
  }

  return data
}

const normalizeList = (data) => {
  if (Array.isArray(data)) return data
  if (Array.isArray(data?.data)) return data.data
  if (Array.isArray(data?.content)) return data.content
  if (Array.isArray(data?.kegiatan)) return data.kegiatan
  if (Array.isArray(data?.pendaftaran)) return data.pendaftaran
  if (Array.isArray(data?.pendaftar)) return data.pendaftar
  if (Array.isArray(data?.pendaftaranList)) return data.pendaftaranList
  if (Array.isArray(data?.registrants)) return data.registrants
  if (Array.isArray(data?.items)) return data.items

  return []
}

export const getKegiatanList = async () => {
  const url = buildApiUrl('/api/eo/kegiatan')
  const response = await fetch(url, {
    method: 'GET',
    headers: getAuthHeaders(),
  })

  const data = await parseResponse(response, 'Gagal mengambil data kegiatan.', { method: 'GET', url })
  return normalizeList(data)
}

export const getMahasiswaKegiatanList = async () => {
  const url = buildApiUrl('/api/kegiatan')
  const response = await fetch(url, {
    method: 'GET',
    headers: getAuthHeaders(),
  })

  const data = await parseResponse(response, 'Gagal mengambil data kegiatan mahasiswa.', { method: 'GET', url })
  return normalizeList(data)
}

export const getKegiatanDetail = async (id) => {
  const url = buildApiUrl(`/api/eo/kegiatan/${id}`)
  const response = await fetch(url, {
    method: 'GET',
    headers: getAuthHeaders(),
  })

  return parseResponse(response, 'Gagal mengambil detail kegiatan.', { method: 'GET', url })
}

export const getKegiatanPendaftaranList = async (id) => {
  const url = buildApiUrl(`/api/eo/kegiatan/${id}/pendaftaran`)
  const response = await fetch(url, {
    method: 'GET',
    headers: getAuthHeaders(),
  })

  const data = await parseResponse(response, 'Gagal mengambil data pendaftar kegiatan.', { method: 'GET', url })
  return normalizeList(data)
}

export const createKegiatan = async (payload) => {
  const isFormData = payload instanceof FormData
  const url = buildApiUrl('/api/eo/kegiatan')
  const token = getStoredToken()

  if (!token) {
    throw new Error('Token tidak ditemukan di localStorage. Silakan login ulang.')
  }

  console.info('[TAK Hub API]', 'POST', url, {
    hasToken: Boolean(token),
    tokenPreview: token ? `${token.slice(0, 12)}...${token.slice(-8)}` : null,
    payload: isFormData ? Object.fromEntries(payload.entries()) : payload,
  })

  const response = await fetch(url, {
    method: 'POST',
    headers: getAuthHeaders({ json: !isFormData }),
    body: isFormData ? payload : JSON.stringify(payload),
  })

  return parseResponse(response, 'Gagal membuat kegiatan.', {
    method: 'POST',
    url,
    hasToken: Boolean(token),
    tokenPreview: token ? `${token.slice(0, 12)}...${token.slice(-8)}` : null,
  })
}

export const updateKegiatan = async (id, payload) => {
  const isFormData = payload instanceof FormData
  const method = 'POST'
  const url = buildApiUrl(`/api/eo/kegiatan/${id}`)
  const token = getStoredToken()

  if (!token) {
    throw new Error('Token tidak ditemukan di localStorage. Silakan login ulang.')
  }

  console.info('[TAK Hub API]', method, url, {
    hasToken: Boolean(token),
    tokenPreview: token ? `${token.slice(0, 12)}...${token.slice(-8)}` : null,
    payload: isFormData ? Object.fromEntries(payload.entries()) : payload,
  })

  const response = await fetch(url, {
    method,
    headers: getAuthHeaders({ json: !isFormData }),
    body: isFormData ? payload : JSON.stringify(payload),
  })

  return parseResponse(response, 'Gagal memperbarui kegiatan.', {
    method,
    url,
    hasToken: Boolean(token),
    tokenPreview: token ? `${token.slice(0, 12)}...${token.slice(-8)}` : null,
  })
}

export const deleteKegiatan = async (id) => {
  const url = buildApiUrl(`/api/eo/kegiatan/${id}`)
  const response = await fetch(url, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  })

  if (response.status === 204) return null

  return parseResponse(response, 'Gagal menghapus kegiatan.', { method: 'DELETE', url })
}
