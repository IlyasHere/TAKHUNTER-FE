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
  let data

  try {
    data = rawBody ? JSON.parse(rawBody) : null
  } catch {
    data = rawBody
  }

  if (!response.ok) {
    const error = new Error(data?.message || data?.error || data || fallbackMessage)
    error.status = response.status
    throw error
  }

  return data
}

const normalizeList = (data) => {
  if (Array.isArray(data)) return data
  if (Array.isArray(data?.data)) return data.data
  if (Array.isArray(data?.content)) return data.content
  if (Array.isArray(data?.items)) return data.items
  if (Array.isArray(data?.sertifikat)) return data.sertifikat

  return []
}

export const getEOSertifikatKegiatan = async () => {
  const response = await fetch(buildApiUrl('/api/eo/sertifikat/kegiatan'), {
    method: 'GET',
    headers: getAuthHeaders(),
  })

  const data = await parseResponse(response, 'Gagal mengambil data kegiatan sertifikat.')
  return normalizeList(data)
}

export const getEOSertifikatPeserta = async (kegiatanId) => {
  const response = await fetch(buildApiUrl(`/api/eo/sertifikat/kegiatan/${kegiatanId}/peserta`), {
    method: 'GET',
    headers: getAuthHeaders(),
  })

  const data = await parseResponse(response, 'Gagal mengambil data peserta sertifikat.')
  return normalizeList(data)
}

export const terbitkanSertifikatMassal = async (kegiatanId, payload) => {
  const response = await fetch(buildApiUrl(`/api/eo/sertifikat/kegiatan/${kegiatanId}/terbitkan`), {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(payload),
  })

  return parseResponse(response, 'Gagal menerbitkan sertifikat.')
}

export const getMahasiswaSertifikat = async () => {
  const response = await fetch(buildApiUrl('/api/mahasiswa/sertifikat'), {
    method: 'GET',
    headers: getAuthHeaders(),
  })

  const data = await parseResponse(response, 'Gagal mengambil sertifikat mahasiswa.')
  return normalizeList(data)
}
