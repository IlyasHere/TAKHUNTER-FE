import { AlertTriangle, ArrowUpRight, CalendarPlus, FilePenLine, ListChecks, Sparkles, Trash2, X, Zap } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Toast from '../../components/ui/Toast'
import { checkAuth } from '../../services/authService'
import { deleteKegiatan, getKegiatanList } from '../../services/kegiatanService'
import EOEventsTable from './components/EOEventsTable'
import EOLayout from './components/EOLayout'
import EOStatCard from './components/EOStatCard'

const EO_TOAST_STORAGE_KEY = 'eoToastMessage'

const getStoredUser = () => {
  try {
    return JSON.parse(localStorage.getItem('user')) || null
  } catch {
    return null
  }
}

function DeleteConfirmationModal({ event, isDeleting, onCancel, onConfirm }) {
  if (!event) return null

  const eventName = event.namaKegiatan || event.name || 'kegiatan ini'

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#111827]/45 px-4 py-6 backdrop-blur-sm">
      <div className="w-full max-w-md overflow-hidden rounded-3xl border border-[#F4C7C7] bg-white shadow-[0_28px_80px_rgba(17,24,39,0.28)]">
        <div className="flex items-start gap-4 border-b border-[#F2E1E1] bg-[#FFF7F7] px-6 py-5">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#FFE5E5] text-[#DC1717]">
            <AlertTriangle className="h-6 w-6" strokeWidth={2.5} />
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="text-xl font-black text-[#171B29]">Hapus kegiatan?</h3>
            <p className="mt-1 text-sm font-semibold leading-relaxed text-[#5B6170]">
              Apakah yakin ingin menghapus event ini? Data yang dihapus tidak bisa dikembalikan.
            </p>
          </div>
          <button type="button" className="rounded-xl p-2 text-[#6B7280] transition hover:bg-white hover:text-[#171B29]" onClick={onCancel} aria-label="Tutup modal">
            <X className="h-5 w-5" strokeWidth={2.5} />
          </button>
        </div>

        <div className="px-6 py-5">
          <div className="rounded-2xl border border-[#E5EAF5] bg-[#FAFBFF] px-4 py-3">
            <p className="text-xs font-extrabold uppercase tracking-wide text-[#7A8191]">Event</p>
            <p className="mt-1 text-base font-black text-[#0D329D]">{eventName}</p>
          </div>

          <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <button
              type="button"
              className="inline-flex h-12 items-center justify-center rounded-xl border border-[#CDD5E8] bg-white px-5 text-sm font-extrabold text-[#4E5363] transition hover:bg-[#F6F8FC]"
              onClick={onCancel}
              disabled={isDeleting}
            >
              Batal
            </button>
            <button
              type="button"
              className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-[#DC1717] px-5 text-sm font-extrabold text-white shadow-[0_14px_28px_rgba(220,23,23,0.20)] transition hover:bg-[#B91212] disabled:cursor-not-allowed disabled:opacity-70"
              onClick={onConfirm}
              disabled={isDeleting}
            >
              <Trash2 className="h-4 w-4" strokeWidth={2.5} />
              {isDeleting ? 'Menghapus...' : 'Hapus Event'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

function DashboardEOPage() {
  const navigate = useNavigate()
  const [organizerName, setOrganizerName] = useState(getStoredUser()?.name || 'Event Organizer')
  const [events, setEvents] = useState([])
  const [isLoadingEvents, setIsLoadingEvents] = useState(true)
  const [eventsError, setEventsError] = useState('')
  const [toastMessage, setToastMessage] = useState('')
  const [eventToDelete, setEventToDelete] = useState(null)
  const [isDeleting, setIsDeleting] = useState(false)

  const handleCreateActivity = () => {
    navigate('/event-organizer/kegiatan/tambah')
  }

  useEffect(() => {
    const storedToastMessage = sessionStorage.getItem(EO_TOAST_STORAGE_KEY)

    if (storedToastMessage) {
      setToastMessage(storedToastMessage)
      sessionStorage.removeItem(EO_TOAST_STORAGE_KEY)
    }

    const token = localStorage.getItem('token')

    if (!token) {
      navigate('/login', { replace: true })
      return
    }

    checkAuth(token)
      .then((user) => {
        if (user.role !== 'EVENT_ORGANIZER') {
          navigate('/dashboard', { replace: true })
          return
        }

        localStorage.setItem('user', JSON.stringify(user))
        setOrganizerName(user.name || 'Event Organizer')

        return getKegiatanList()
      })
      .then((kegiatan) => {
        if (kegiatan) {
          setEvents(kegiatan)
        }
      })
      .catch((error) => {
        if (error.message?.toLowerCase().includes('sesi') || error.message?.toLowerCase().includes('token')) {
          localStorage.removeItem('token')
          localStorage.removeItem('user')
          navigate('/login', { replace: true })
          return
        }

        setEventsError(error.message || 'Gagal memuat data kegiatan. Pastikan backend berjalan dan token masih valid.')
      })
      .finally(() => {
        setIsLoadingEvents(false)
      })
  }, [navigate])

  const handleAskDeleteKegiatan = (id) => {
    const selectedEvent = events.find((event) => event.id === id)
    setEventToDelete(selectedEvent || { id })
  }

  const handleCancelDelete = () => {
    if (isDeleting) return
    setEventToDelete(null)
  }

  const handleConfirmDelete = async () => {
    if (!eventToDelete?.id) return

    try {
      setIsDeleting(true)
      await deleteKegiatan(eventToDelete.id)
      setEvents((currentEvents) => currentEvents.filter((event) => event.id !== eventToDelete.id))
      setEventToDelete(null)
      setToastMessage('Kegiatan berhasil dihapus.')
    } catch (error) {
      setEventsError(error.message || 'Gagal menghapus kegiatan.')
    } finally {
      setIsDeleting(false)
    }
  }

  useEffect(() => {
    if (!toastMessage) return undefined

    const timeoutId = window.setTimeout(() => setToastMessage(''), 3500)
    return () => window.clearTimeout(timeoutId)
  }, [toastMessage])

  const totalKegiatan = events.length
  const kegiatanAktif = events.filter((event) => event.statusPublikasi === 'AKTIF' || event.status === 'AKTIF').length
  const draftKegiatan = events.filter((event) => event.statusPublikasi === 'DRAFT' || event.status === 'DRAFT').length

  return (
    <EOLayout title="Kegiatan Event Organizer" organizerName={organizerName}>
      <Toast message={toastMessage} onClose={() => setToastMessage('')} />
      <DeleteConfirmationModal event={eventToDelete} isDeleting={isDeleting} onCancel={handleCancelDelete} onConfirm={handleConfirmDelete} />
      <section className="mb-7 overflow-hidden rounded-3xl border border-[#D8E0F2] bg-white shadow-[0_16px_44px_rgba(20,36,82,0.07)]">
        <div className="flex flex-col gap-6 p-6 lg:flex-row lg:items-stretch lg:justify-between lg:p-8">
          <div className="flex min-w-0 flex-1 flex-col justify-between">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-[#DDE5FF] bg-[#F5F7FF] px-3 py-1.5 text-xs font-extrabold text-[#0D329D]">
                <Sparkles className="h-3.5 w-3.5" strokeWidth={2.4} />
                Dashboard Event Organizer
              </div>
              <p className="mt-5 text-sm font-bold text-[#4E5363]">Halo, {organizerName}</p>
              <h2 className="mt-2 text-[38px] font-black leading-none text-[#0D329D]">Kelola Kegiatan</h2>
              <p className="mt-3 max-w-[760px] text-[19px] leading-relaxed text-[#4E5363]">
                Kelola draft, publikasi, dan data kegiatan akademik dalam satu ruang kerja yang rapi.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleCreateActivity}
            className="group relative flex min-h-[178px] w-full overflow-hidden rounded-3xl bg-[#0D329D] p-6 text-left text-white shadow-[0_22px_54px_rgba(13,50,157,0.24)] transition duration-200 hover:-translate-y-1 hover:bg-[#09277D] hover:shadow-[0_28px_64px_rgba(13,50,157,0.30)] lg:w-[360px]"
          >
            <span className="absolute right-[-42px] top-[-42px] h-32 w-32 rounded-full border border-white/20" />
            <span className="absolute bottom-[-56px] right-10 h-32 w-32 rounded-full bg-white/10 blur-2xl" />
            <span className="relative flex h-full w-full flex-col justify-between">
              <span className="flex items-start justify-between gap-5">
                <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/14 ring-1 ring-white/18 transition group-hover:scale-105 group-hover:bg-white/20">
                  <CalendarPlus className="h-7 w-7" strokeWidth={2.35} />
                </span>
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-[#0D329D] transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
                  <ArrowUpRight className="h-5 w-5" strokeWidth={2.6} />
                </span>
              </span>
              <span>
                <span className="block text-[26px] font-black leading-tight">Tambah Kegiatan Baru</span>
              </span>
            </span>
          </button>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-3">
        <EOStatCard label="Total Kegiatan" value={String(totalKegiatan)} icon={ListChecks} tone="indigo" />
        <EOStatCard label="Kegiatan Aktif" value={String(kegiatanAktif)} icon={Zap} tone="blue" />
        <EOStatCard label="Draft Kegiatan" value={String(draftKegiatan)} icon={FilePenLine} tone="gray" />
      </section>

      <div className="mt-4">
        <EOEventsTable events={events} isLoading={isLoadingEvents} errorMessage={eventsError} onDelete={handleAskDeleteKegiatan} />
      </div>
    </EOLayout>
  )
}

export default DashboardEOPage
