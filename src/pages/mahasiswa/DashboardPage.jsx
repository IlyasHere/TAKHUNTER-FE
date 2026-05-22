import { Filter, Star } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import EventCard from '../../components/cards/EventCard'
import LatestEventCard from '../../components/cards/LatestEventCard'
import DashboardLayout from '../../components/layout/DashboardLayout'
import Card from '../../components/ui/Card'
import Modal from '../../components/ui/Modal'
import Toast from '../../components/ui/Toast'
import { API_BASE_URL } from '../../lib/api'
import { getBookmarkIds } from '../../services/bookmarkService'
import { getMahasiswaKegiatanList } from '../../services/kegiatanService'
import { getMahasiswaSertifikat } from '../../services/sertifikatService'
import DetailKegiatan from './DetailKegiatan'
import FormPendaftaran from './FormPendaftaran'

const fallbackImage =
  'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?auto=format&fit=crop&w=900&q=80'

const fallbackThumb =
  'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=500&q=80'

const buildAssetUrl = (value) => {
  if (!value) return ''
  if (
    value.startsWith('http://') ||
    value.startsWith('https://') ||
    value.startsWith('data:')
  ) {
    return value
  }

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
  if (!value) return 'Lainnya'

  return String(value).charAt(0).toUpperCase() + String(value).slice(1).toLowerCase()
}

const mapKegiatanToEvent = (event) => {
  const image = buildAssetUrl(
    event.bannerPath ||
      event.bannerUrl ||
      event.banner ||
      event.gambarUrl ||
      event.imageUrl
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
    saved: false,
    status: event.statusPublikasi || event.status,
  }
}

const getStoredUser = () => {
  try {
    return JSON.parse(localStorage.getItem('user')) || null
  } catch {
    return null
  }
}

const getCertificatePoints = (certificate) => Number(certificate.poinTak ?? certificate.points ?? 0)

function DashboardPage() {
  const navigate = useNavigate()
  const storedUser = getStoredUser()
  const username = storedUser?.name || 'Mahasiswa'
  const [events, setEvents] = useState([])
  const [totalTakPoints, setTotalTakPoints] = useState(0)
  const [selectedEvent, setSelectedEvent] = useState(null)
  const [modalType, setModalType] = useState(null)
  const [activeCategory, setActiveCategory] = useState('Semua')
  const [isLoadingEvents, setIsLoadingEvents] = useState(true)
  const [eventsError, setEventsError] = useState('')
  const [toastMessage, setToastMessage] = useState('')

  useEffect(() => {
    Promise.all([
      getMahasiswaKegiatanList(),
      getBookmarkIds().catch(() => []),
      getMahasiswaSertifikat().catch((error) => {
        if (error.status === 401) {
          localStorage.removeItem('token')
          localStorage.removeItem('user')
          navigate('/login', { replace: true })
        }

        return []
      }),
    ])
      .then(([kegiatan, bookmarkIds, certificates]) => {
        const bookmarkIdSet = new Set(bookmarkIds.map((id) => Number(id)))
        const mappedEvents = kegiatan
          .filter(
            (event) =>
              !event.statusPublikasi ||
              event.statusPublikasi === 'AKTIF' ||
              event.status === 'AKTIF'
          )
          .map(mapKegiatanToEvent)
          .map((event) => ({ ...event, saved: bookmarkIdSet.has(Number(event.id)) }))

        setEvents(mappedEvents)
        setTotalTakPoints(certificates.reduce((sum, certificate) => sum + getCertificatePoints(certificate), 0))
      })
      .catch((error) => {
        setEventsError(error.message || 'Gagal memuat data kegiatan.')
      })
      .finally(() => {
        setIsLoadingEvents(false)
      })
  }, [navigate])

  const categories = useMemo(() => {
    const uniqueCategories = [
      ...new Set(events.map((event) => event.category).filter(Boolean)),
    ]

    return ['Semua', ...uniqueCategories]
  }, [events])

  const filteredEvents = activeCategory === 'Semua' ? events : events.filter((event) => event.category === activeCategory)
  const latestEvents = events.slice(0, 2)

  const openDetailModal = (event) => {
    setSelectedEvent(event)
    setModalType('detail')
  }

  const closeModal = () => {
    setSelectedEvent(null)
    setModalType(null)
  }

  const handleRegistrationSuccess = () => {
    closeModal()
    setToastMessage('Pendaftaran kegiatan berhasil disimpan.')
  }

  useEffect(() => {
    if (!toastMessage) return undefined

    const timeoutId = window.setTimeout(() => setToastMessage(''), 3500)
    return () => window.clearTimeout(timeoutId)
  }, [toastMessage])

  return (
    <DashboardLayout title="Dashboard Mahasiswa">
      <Toast message={toastMessage} onClose={() => setToastMessage('')} />
      <section className="grid gap-6 xl:grid-cols-[360px_1fr]">
        <div>
          <Card className="border-[#D9DEEE] p-6 shadow-none transition duration-300 hover:-translate-y-0.5 hover:shadow-[0_14px_34px_rgba(71,88,224,0.12)]">
            <h2 className="text-[22px] font-extrabold text-[#171B29]">Halo, {username}</h2>
            <p className="mt-2 text-[15px] font-medium text-[#7A8298]">Selamat datang kembali di TAK App.</p>

            <div className="mt-4 flex h-[66px] w-[224px] items-center justify-between rounded-2xl bg-gradient-to-r from-[#2F73F6] to-[#4770F4] px-6 text-white">
              <div>
                <p className="text-xs font-medium text-white/85">Total Poin TAK</p>
                <p className="mt-1 text-[30px] font-light leading-none">
                  {totalTakPoints.toLocaleString('id-ID')}<span className="ml-1 text-base font-medium">Poin</span>
                </p>
              </div>
              <Star className="h-9 w-9 fill-yellow-300 text-yellow-300" />
            </div>
          </Card>

          <Card className="mt-6 border-[#D9DEEE] p-5 shadow-none">
            <p className="text-xs font-extrabold uppercase tracking-wide text-[#96A0B5]">
              Ringkasan
            </p>

            <div className="mt-4 grid grid-cols-2 gap-3">
              <div className="rounded-2xl bg-[#F5F7FF] px-4 py-3">
                <p className="text-[11px] font-bold text-[#7A8298]">Kegiatan</p>
                <p className="mt-1 text-2xl font-black text-primary">
                  {events.length}
                </p>
              </div>

              <div className="rounded-2xl bg-[#F7F8FB] px-4 py-3">
                <p className="text-[11px] font-bold text-[#7A8298]">Kategori</p>
                <p className="mt-1 text-2xl font-black text-[#171B29]">
                  {Math.max(categories.length - 1, 0)}
                </p>
              </div>
            </div>
          </Card>
        </div>

        <Card className="border-[#D9DEEE] p-6 shadow-none transition duration-300 hover:-translate-y-0.5 hover:shadow-[0_14px_34px_rgba(71,88,224,0.12)]">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-[18px] font-extrabold text-[#171B29]">Kegiatan Terbaru</h2>
            <button className="text-xs font-extrabold text-primary" type="button">Lihat semua</button>
          </div>
          {isLoadingEvents ? <p className="rounded-2xl bg-[#F8FAFF] p-6 text-center text-sm font-semibold text-[#747B8E]">Memuat kegiatan terbaru...</p> : null}
          {!isLoadingEvents && latestEvents.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2">
              {latestEvents.map((event) => (
                <LatestEventCard key={event.id} event={event} onClick={() => openDetailModal(event)} />
              ))}
            </div>
          ) : null}

          {!isLoadingEvents && latestEvents.length === 0 ? (
            <p className="rounded-2xl bg-[#F8FAFF] p-6 text-center text-sm font-semibold text-[#747B8E]">
              Belum ada kegiatan terbaru.
            </p>
          ) : null}
        </Card>
      </section>

      <section className="mt-10">
        <div className="mb-6 rounded-[24px] border border-[#D9DEEE] bg-white p-5 shadow-[0_12px_30px_rgba(31,41,55,0.04)]">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h2 className="text-[24px] font-black text-[#171B29]">
                Kegiatan Tersedia
              </h2>

              <p className="mt-1 text-sm font-semibold text-[#7A8298]">
                {isLoadingEvents
                  ? 'Memuat daftar kegiatan...'
                  : `${filteredEvents.length} dari ${events.length} kegiatan ditampilkan`}
              </p>
            </div>

            <div className="flex items-center gap-2 rounded-2xl border border-[#DDE3F0] bg-[#F8FAFF] p-2">
              <div className="hidden h-10 items-center gap-2 rounded-xl px-3 text-xs font-extrabold text-[#667085] sm:flex">
                <Filter className="h-4 w-4" strokeWidth={2.4} />
                Kategori
              </div>

              <div className="flex max-w-full gap-2 overflow-x-auto">
                {categories.map((category) => (
                  <button
                    key={category}
                    type="button"
                    className={`h-10 shrink-0 rounded-xl px-4 text-xs font-extrabold transition ${
                      activeCategory === category
                        ? 'bg-primary text-white shadow-[0_8px_18px_rgba(71,88,224,0.22)]'
                        : 'bg-white text-[#7A8298] ring-1 ring-[#E1E6F2] hover:text-primary hover:ring-primary/35'
                    }`}
                    onClick={() => setActiveCategory(category)}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {eventsError ? (
          <p className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-600">
            {eventsError}
          </p>
        ) : null}

        {isLoadingEvents ? (
          <p className="rounded-2xl bg-white p-8 text-center text-sm font-semibold text-[#747B8E]">
            Memuat data kegiatan...
          </p>
        ) : null}

        {!isLoadingEvents && filteredEvents.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {filteredEvents.map((event) => (
              <EventCard key={event.id} event={event} onClick={() => openDetailModal(event)} />
            ))}
          </div>
        ) : null}

        {!isLoadingEvents && filteredEvents.length === 0 ? (
          <p className="rounded-2xl bg-white p-8 text-center text-sm font-semibold text-[#747B8E]">
            Belum ada kegiatan tersedia.
          </p>
        ) : null}
      </section>

      <Modal isOpen={Boolean(selectedEvent)} onClose={closeModal} maxWidth={modalType === 'form' ? 'max-w-5xl' : 'max-w-6xl'}>
        {selectedEvent && modalType === 'detail' ? (
          <DetailKegiatan event={selectedEvent} onClose={closeModal} onDaftar={() => setModalType('form')} />
        ) : null}
        {selectedEvent && modalType === 'form' ? (
          <FormPendaftaran event={selectedEvent} onClose={closeModal} onSuccess={handleRegistrationSuccess} onBack={() => setModalType('detail')} />
        ) : null}
      </Modal>
    </DashboardLayout>
  )
}

export default DashboardPage
