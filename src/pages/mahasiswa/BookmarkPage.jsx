import { Bookmark, Eye, Search, Trash2 } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import EventCard from '../../components/cards/EventCard'
import DashboardLayout from '../../components/layout/DashboardLayout'
import Modal from '../../components/ui/Modal'
import { API_BASE_URL } from '../../lib/api'
import { getBookmarkList, removeBookmark } from '../../services/bookmarkService'
import DetailKegiatan from './KegiatanPage'

const fallbackImage =
  'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?auto=format&fit=crop&w=900&q=80'

const fallbackThumb =
  'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=500&q=80'

const buildAssetUrl = (value) => {
  if (!value) return ''
  if (value.startsWith('http://') || value.startsWith('https://') || value.startsWith('data:')) return value

  const baseUrl = API_BASE_URL?.replace(/\/$/, '') || ''
  const path = value.startsWith('/') ? value : `/${value}`

  return `${baseUrl}${path}`
}

const formatDate = (value) => {
  if (!value) return '-'

  const date = new Date(`${value}T00:00:00`)
  if (Number.isNaN(date.getTime())) return value

  return new Intl.DateTimeFormat('id-ID', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(date)
}

const formatTime = (value) => {
  if (!value) return '-'
  return `${String(value).slice(0, 5).replace(':', '.')} WIB`
}

const normalizeCategory = (value) => {
  if (!value) return '-'
  return String(value).charAt(0).toUpperCase() + String(value).slice(1).toLowerCase()
}

const mapKegiatanToEvent = (event) => {
  const image = buildAssetUrl(
    event.bannerPath ||
      event.bannerUrl ||
      event.banner ||
      event.gambarUrl ||
      event.imageUrl,
  )

  return {
    id: event.id,
    title: event.namaKegiatan || event.name || event.title || '-',
    category: normalizeCategory(event.kategori || event.category),
    type: event.wajib ? 'WAJIB' : 'OPSIONAL',
    date: formatDate(event.tanggal || event.date),
    time: formatTime(event.waktu || event.time),
    location: event.lokasi || event.location || '-',
    points: event.poinTak ?? event.pointTak ?? event.points ?? 0,
    quota: event.kuotaPeserta ?? event.quota ?? null,
    description: event.deskripsi || event.description || 'Detail kegiatan belum tersedia.',
    image: image || fallbackImage,
    thumb: image || fallbackThumb,
    saved: true,
    status: event.statusPublikasi || event.status,
  }
}

function BookmarkPage() {
  const navigate = useNavigate()
  const [bookmarks, setBookmarks] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedEvent, setSelectedEvent] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    if (!localStorage.getItem('token')) {
      navigate('/login', { replace: true })
      return
    }

    getBookmarkList()
      .then((items) => {
        setBookmarks(items.map(mapKegiatanToEvent))
      })
      .catch((error) => {
        setErrorMessage(error.message || 'Gagal memuat bookmark.')
      })
      .finally(() => {
        setIsLoading(false)
      })
  }, [navigate])

  const filteredBookmarks = useMemo(() => {
    const query = searchQuery.trim().toLowerCase()
    if (!query) return bookmarks

    return bookmarks.filter((event) =>
      [event.title, event.category, event.location]
        .some((value) => String(value || '').toLowerCase().includes(query)),
    )
  }, [bookmarks, searchQuery])

  const handleRemoveBookmark = async (event) => {
    const previousBookmarks = bookmarks
    setBookmarks((currentBookmarks) => currentBookmarks.filter((bookmark) => bookmark.id !== event.id))
    if (selectedEvent?.id === event.id) setSelectedEvent(null)

    try {
      await removeBookmark(event.id)
    } catch (error) {
      setBookmarks(previousBookmarks)
      setErrorMessage(error.message || 'Gagal menghapus bookmark.')
    }
  }

  return (
    <DashboardLayout title="Bookmark Mahasiswa">
      <div className="mx-auto max-w-6xl py-6">
        <section className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Kegiatan Tersimpan</h1>
            <p className="mt-1 text-sm text-gray-500">
              Daftar kegiatan yang kamu simpan untuk dilihat kembali nanti.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <label className="flex h-11 min-w-0 items-center rounded-xl border border-gray-200 bg-white px-3 shadow-sm sm:w-[280px]">
              <Search className="h-5 w-5 shrink-0 text-gray-400" strokeWidth={2.1} />
              <input
                type="text"
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder="Cari bookmark..."
                className="h-full min-w-0 flex-1 bg-transparent px-3 text-sm text-gray-700 outline-none placeholder:text-gray-400"
              />
            </label>

            <div className="flex items-center gap-4 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
              <div className="flex items-center justify-center rounded-full bg-blue-100 p-3 text-blue-600">
                <Bookmark size={22} fill="currentColor" />
              </div>
              <div className="pr-2">
                <p className="mb-0.5 text-[10px] font-bold uppercase tracking-wider text-gray-500">Total Bookmark</p>
                <p className="text-xl font-bold text-gray-900">{bookmarks.length} Kegiatan</p>
              </div>
            </div>
          </div>
        </section>

        {errorMessage ? (
          <p className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-600">
            {errorMessage}
          </p>
        ) : null}

        {isLoading ? (
          <p className="rounded-2xl bg-white p-8 text-center text-sm font-semibold text-gray-500">
            Memuat bookmark...
          </p>
        ) : null}

        {!isLoading && filteredBookmarks.length === 0 ? (
          <div className="rounded-2xl border border-gray-100 bg-white p-10 text-center shadow-sm">
            <Bookmark className="mx-auto h-10 w-10 text-blue-600" strokeWidth={2.2} />
            <h2 className="mt-4 text-lg font-bold text-gray-900">Belum ada bookmark</h2>
            <p className="mt-2 text-sm text-gray-500">Simpan kegiatan dari dashboard mahasiswa untuk menampilkannya di sini.</p>
          </div>
        ) : null}

        {!isLoading && filteredBookmarks.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredBookmarks.map((event) => (
              <div key={event.id} className="relative">
                <EventCard
                  event={event}
                  onClick={() => setSelectedEvent(event)}
                  onToggleBookmark={handleRemoveBookmark}
                />
                <div className="mt-3 grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setSelectedEvent(event)}
                    className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 text-sm font-semibold text-white transition hover:bg-blue-700"
                  >
                    <Eye size={16} />
                    Detail
                  </button>
                  <button
                    type="button"
                    onClick={() => handleRemoveBookmark(event)}
                    className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-4 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
                  >
                    <Trash2 size={16} />
                    Hapus
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : null}
      </div>

      <Modal isOpen={!!selectedEvent} onClose={() => setSelectedEvent(null)} maxWidth="max-w-6xl">
        {selectedEvent ? (
          <DetailKegiatan
            event={selectedEvent}
            onDaftar={() => navigate('/dashboard')}
            onClose={() => setSelectedEvent(null)}
            onToggleBookmark={handleRemoveBookmark}
          />
        ) : null}
      </Modal>
    </DashboardLayout>
  )
}

export default BookmarkPage
