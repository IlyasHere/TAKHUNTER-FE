import { API_BASE_URL } from '../lib/api'

export const PROFILE_UPDATED_EVENT = 'takhub:profile-updated'

export const getStoredUser = () => {
  try {
    return JSON.parse(localStorage.getItem('user')) || null
  } catch {
    return null
  }
}

export const buildAssetUrl = (value) => {
  if (!value) return ''
  if (value.startsWith('http://') || value.startsWith('https://') || value.startsWith('data:') || value.startsWith('blob:')) return value

  const baseUrl = API_BASE_URL?.replace(/\/$/, '') || ''
  const path = value.startsWith('/') ? value : `/${value}`

  return `${baseUrl}${path}`
}

export const getProfilePhotoUrl = (user) => buildAssetUrl(user?.profilePhotoPath || user?.profilePhotoUrl || '')

export const notifyProfileUpdated = () => {
  window.dispatchEvent(new Event(PROFILE_UPDATED_EVENT))
}
