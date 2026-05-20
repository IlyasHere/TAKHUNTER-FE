import { API_BASE_URL } from '../../lib/api'

export const buildAssetUrl = (value) => {
  if (!value) return ''
  if (value.startsWith('http://') || value.startsWith('https://') || value.startsWith('data:')) return value

  const baseUrl = API_BASE_URL?.replace(/\/$/, '') || ''
  const path = value.startsWith('/') ? value : `/${value}`

  return `${baseUrl}${path}`
}

export const getBannerUrl = (event) => buildAssetUrl(event?.bannerPath || event?.bannerUrl || event?.banner || event?.gambarUrl || event?.imageUrl)

export const getRegistrantCount = (event) => event?.jumlahPendaftar ?? event?.pendaftar ?? event?.registrants ?? 0

export const toTimeInput = (value) => {
  if (!value) return ''
  return String(value).slice(0, 5)
}

export const formatDate = (value) => {
  if (!value) return '-'

  return new Intl.DateTimeFormat('id-ID', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  }).format(new Date(value))
}

export const formatTime = (value) => {
  if (!value) return '-'
  return String(value).slice(0, 5)
}

export const getStatusLabel = (status) => {
  if (status === 'AKTIF') return 'Aktif'
  if (status === 'SELESAI') return 'Selesai'
  return 'Draft'
}

export const getStatusClass = (status) => {
  if (status === 'AKTIF') return 'bg-[#DFF7E8] text-[#159447]'
  if (status === 'SELESAI') return 'bg-[#DCEAFF] text-[#1459D8]'
  return 'bg-[#E0E3E6] text-[#555B68]'
}
