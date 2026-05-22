import { buildApiUrl } from '../lib/api'

const getStoredToken = () => {
  const rawToken = localStorage.getItem('token') || localStorage.getItem('accessToken') || ''
  const token = rawToken.trim().replace(/^"|"$/g, '')

  return token.startsWith('Bearer ') ? token.substring(7).trim() : token
}

const parseResponse = async (response, fallbackMessage) => {
  const rawBody = await response.text().catch(() => '')
  let data = null

  try {
    data = rawBody ? JSON.parse(rawBody) : null
  } catch {
    data = null
  }

  if (!response.ok) {
    throw new Error(data?.message || data?.error || fallbackMessage)
  }

  return data
}

export const updateProfile = async ({ name, email, profilePhoto }) => {
  const token = getStoredToken()

  if (!token) {
    throw new Error('Token tidak ditemukan. Silakan login ulang.')
  }

  const formData = new FormData()
  formData.append('name', name)
  formData.append('email', email)

  if (profilePhoto) {
    formData.append('profilePhoto', profilePhoto)
  }

  const response = await fetch(buildApiUrl('/api/auth/profile'), {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  })

  return parseResponse(response, 'Gagal memperbarui profil.')
}
