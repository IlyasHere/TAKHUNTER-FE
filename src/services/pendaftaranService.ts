import { buildApiUrl } from '../lib/api'

// Definisikan tipe data untuk formData
export interface PendaftaranData {
  kegiatanId: number;
  namaMahasiswa: string;
  nim: string;
  programStudi: string;
  email: string;
  nomorWhatsApp: string;
  alasan: string;
}

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

const parseResponse = async (response: Response, fallbackMessage: string) => {
  const rawBody = await response.text().catch(() => '')
  let data: any = null

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

const normalizeList = (data: any) => {
  if (Array.isArray(data)) return data
  if (Array.isArray(data?.data)) return data.data
  if (Array.isArray(data?.content)) return data.content
  if (Array.isArray(data?.pendaftaran)) return data.pendaftaran

  return []
}

const API_URL = buildApiUrl('/api/pendaftaran');

// Tambahkan : PendaftaranData setelah formData
export const submitPendaftaranForm = async (formData: PendaftaranData) => {
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Gagal melakukan pendaftaran');
    }

    return data;
  } catch (error) {
    throw error;
  }
};

export const getPendaftarByKegiatan = async (kegiatanId: number) => {
  const url = buildApiUrl(`/api/eo/pendaftaran/kegiatan/${kegiatanId}`)
  const response = await fetch(url, {
    method: 'GET',
    headers: getAuthHeaders(),
  })

  const data = await parseResponse(response, 'Gagal mengambil data pendaftar.')
  return normalizeList(data)
}

export const updateStatusPendaftaran = async (pendaftaranId: number, status: string) => {
  const url = buildApiUrl(`/api/eo/pendaftaran/${pendaftaranId}/status`)
  const response = await fetch(url, {
    method: 'PATCH',
    headers: getAuthHeaders(),
    body: JSON.stringify({ status }),
  })

  return parseResponse(response, 'Gagal memperbarui status pendaftaran.')
}

export const getPendaftaranSaya = async () => {
  const url = buildApiUrl('/api/pendaftaran/saya')
  const response = await fetch(url, {
    method: 'GET',
    headers: getAuthHeaders(),
  })

  const data = await parseResponse(response, 'Gagal mengambil riwayat pendaftaran.')
  return normalizeList(data)
}

export const getRiwayatEOPeserta = async () => {
  const url = buildApiUrl('/api/eo/pendaftaran/riwayat')
  const response = await fetch(url, {
    method: 'GET',
    headers: getAuthHeaders(),
  })

  const data = await parseResponse(response, 'Gagal mengambil riwayat peserta.')
  return normalizeList(data)
}
