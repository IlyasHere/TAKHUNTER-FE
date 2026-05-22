import { Check, ClipboardCheck, Mail, Phone, Search, UserRound, X } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import Toast from '../../components/ui/Toast'
import { checkAuth } from '../../services/authService'
import { getKegiatanList } from '../../services/kegiatanService'
import { getPendaftarByKegiatan, updateStatusPendaftaran } from '../../services/pendaftaranService'
import EOLayout from './components/EOLayout'

const getStoredUser = () => {
  try {
    return JSON.parse(localStorage.getItem('user')) || null
  } catch {
    return null
  }
}

const formatDate = (value) => {
  if (!value) return '-'

  return new Intl.DateTimeFormat('id-ID', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(new Date(value))
}

const getStatusMeta = (status) => {
  const normalizedStatus = status || 'PENDING'

  if (normalizedStatus === 'DITERIMA') {
    return {
      label: 'Diterima',
      className: 'bg-[#DFF7E8] text-[#137A3A]',
    }
  }

  if (normalizedStatus === 'DITOLAK') {
    return {
      label: 'Ditolak',
      className: 'bg-[#FFE5E5] text-[#B91212]',
    }
  }

  return {
    label: 'Menunggu',
    className: 'bg-[#FFF4D6] text-[#916400]',
  }
}

const getRegistrantCount = (event) => Number(event?.jumlahPendaftar ?? event?.pendaftar ?? event?.registrants ?? 0)

function KelolaPendaftaranPage() {
  const navigate = useNavigate()
  const [organizerName, setOrganizerName] = useState(getStoredUser()?.name || 'Event Organizer')
  const [events, setEvents] = useState([])
  const [selectedEventId, setSelectedEventId] = useState(null)
  const [registrants, setRegistrants] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [isLoadingEvents, setIsLoadingEvents] = useState(true)
  const [isLoadingRegistrants, setIsLoadingRegistrants] = useState(false)
  const [updatingId, setUpdatingId] = useState(null)
  const [errorMessage, setErrorMessage] = useState('')
  const [toastMessage, setToastMessage] = useState('')

  useEffect(() => {
    const token = localStorage.getItem('token')

    if (!token) {
      navigate('/login', { replace: true })
      return
    }

    checkAuth(token)
      .then((user) => {
        if (user.role !== 'EVENT_ORGANIZER') {
          navigate('/dashboard', { replace: true })
          return null
        }

        localStorage.setItem('user', JSON.stringify(user))
        setOrganizerName(user.name || 'Event Organizer')

        return getKegiatanList()
      })
      .then((kegiatan) => {
        if (!kegiatan) return

        setEvents(kegiatan)
        setSelectedEventId(kegiatan[0]?.id ?? null)
      })
      .catch((error) => {
        setErrorMessage(error.message || 'Gagal memuat data kegiatan.')
      })
      .finally(() => {
        setIsLoadingEvents(false)
      })
  }, [navigate])

  useEffect(() => {
    if (!selectedEventId) {
      setRegistrants([])
      return
    }

    setIsLoadingRegistrants(true)
    setErrorMessage('')

    getPendaftarByKegiatan(selectedEventId)
      .then(setRegistrants)
      .catch((error) => {
        setRegistrants([])
        setErrorMessage(error.message || 'Gagal memuat data pendaftar.')
      })
      .finally(() => {
        setIsLoadingRegistrants(false)
      })
  }, [selectedEventId])

  useEffect(() => {
    if (!toastMessage) return undefined

    const timeoutId = window.setTimeout(() => setToastMessage(''), 3500)
    return () => window.clearTimeout(timeoutId)
  }, [toastMessage])

  const selectedEvent = events.find((event) => event.id === selectedEventId) || null

  const filteredRegistrants = useMemo(() => {
    const query = searchQuery.trim().toLowerCase()
    if (!query) return registrants

    return registrants.filter((registrant) => {
      const fields = [
        registrant.namaMahasiswa,
        registrant.nim,
        registrant.programStudi,
        registrant.email,
      ]

      return fields.some((field) => String(field || '').toLowerCase().includes(query))
    })
  }, [registrants, searchQuery])

  const stats = useMemo(() => {
    return registrants.reduce(
      (result, registrant) => {
        const status = registrant.status || 'PENDING'
        if (status === 'DITERIMA') result.diterima += 1
        else if (status === 'DITOLAK') result.ditolak += 1
        else result.pending += 1

        return result
      },
      { pending: 0, diterima: 0, ditolak: 0 },
    )
  }, [registrants])

  const handleUpdateStatus = async (pendaftaranId, status) => {
    try {
      setUpdatingId(pendaftaranId)
      const updatedRegistrant = await updateStatusPendaftaran(pendaftaranId, status)

      setRegistrants((currentRegistrants) =>
        currentRegistrants.map((registrant) =>
          registrant.id === pendaftaranId ? updatedRegistrant : registrant,
        ),
      )
      setToastMessage(status === 'DITERIMA' ? 'Pendaftaran mahasiswa diterima.' : 'Pendaftaran mahasiswa ditolak.')
    } catch (error) {
      setErrorMessage(error.message || 'Gagal memperbarui status pendaftaran.')
    } finally {
      setUpdatingId(null)
    }
  }

  return (
    <EOLayout title="Kelola Pendaftaran" organizerName={organizerName}>
      <Toast message={toastMessage} onClose={() => setToastMessage('')} />

      <section className="mb-6 rounded-2xl border border-[#D8E0F2] bg-white p-6 shadow-[0_12px_34px_rgba(20,36,82,0.06)]">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="inline-flex items-center gap-2 rounded-full bg-[#F1F4FF] px-3 py-1.5 text-xs font-extrabold text-[#0D329D]">
              <ClipboardCheck className="h-4 w-4" strokeWidth={2.4} />
              Approval Peserta
            </p>
            <h2 className="mt-4 text-[30px] font-black leading-tight text-[#171B29]">Pendaftaran Mahasiswa</h2>
            <p className="mt-2 max-w-2xl text-sm font-semibold leading-relaxed text-[#656C7D]">
              Pilih kegiatan yang sudah dibuat, lihat daftar mahasiswa yang mendaftar, lalu tentukan status pendaftarannya.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-3 sm:min-w-[360px]">
            <SummaryItem label="Menunggu" value={stats.pending} tone="amber" />
            <SummaryItem label="Diterima" value={stats.diterima} tone="green" />
            <SummaryItem label="Ditolak" value={stats.ditolak} tone="red" />
          </div>
        </div>
      </section>

      {errorMessage ? (
        <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-600">
          {errorMessage}
        </div>
      ) : null}

      <section className="grid gap-6 xl:grid-cols-[360px_1fr]">
        <div className="overflow-hidden rounded-2xl border border-[#D8E0F2] bg-white shadow-[0_12px_34px_rgba(20,36,82,0.06)]">
          <div className="border-b border-[#E3E8F4] px-5 py-4">
            <p className="text-sm font-black text-[#171B29]">Kegiatan EO</p>
            <p className="mt-1 text-xs font-bold text-[#7A8298]">{events.length} kegiatan ditemukan</p>
          </div>

          <div className="max-h-[620px] overflow-y-auto p-3">
            {isLoadingEvents ? (
              <p className="rounded-xl bg-[#F8FAFF] p-5 text-center text-sm font-semibold text-[#747B8E]">Memuat kegiatan...</p>
            ) : null}

            {!isLoadingEvents && events.length === 0 ? (
              <p className="rounded-xl bg-[#F8FAFF] p-5 text-center text-sm font-semibold text-[#747B8E]">Belum ada kegiatan yang dibuat.</p>
            ) : null}

            {!isLoadingEvents && events.map((event) => {
              const isSelected = event.id === selectedEventId

              return (
                <button
                  key={event.id}
                  type="button"
                  onClick={() => setSelectedEventId(event.id)}
                  className={`mb-3 w-full rounded-xl border p-4 text-left transition ${
                    isSelected
                      ? 'border-[#0D329D] bg-[#F4F7FF] shadow-[inset_4px_0_0_#0D329D]'
                      : 'border-[#E1E6F2] bg-white hover:border-[#B8C5EE] hover:bg-[#FAFBFF]'
                  }`}
                >
                  <p className="line-clamp-2 text-sm font-black leading-snug text-[#171B29]">{event.namaKegiatan || event.name || '-'}</p>
                  <div className="mt-3 flex items-center justify-between gap-3">
                    <span className="rounded-full bg-[#DCEAFF] px-2.5 py-1 text-[11px] font-extrabold text-[#174EAA]">{event.kategori || '-'}</span>
                    <span className="text-xs font-bold text-[#6C7486]">{formatDate(event.tanggal)}</span>
                  </div>
                  <p className="mt-3 text-xs font-extrabold text-[#0D329D]">{getRegistrantCount(event)} pendaftar</p>
                </button>
              )
            })}
          </div>
        </div>

        <div className="overflow-hidden rounded-2xl border border-[#D8E0F2] bg-white shadow-[0_12px_34px_rgba(20,36,82,0.06)]">
          <div className="flex flex-col gap-4 border-b border-[#E3E8F4] px-5 py-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-sm font-black text-[#171B29]">{selectedEvent?.namaKegiatan || 'Pilih kegiatan'}</p>
              <p className="mt-1 text-xs font-bold text-[#7A8298]">
                {selectedEvent ? `${filteredRegistrants.length} dari ${registrants.length} mahasiswa ditampilkan` : 'Daftar pendaftar akan muncul di sini'}
              </p>
            </div>

            <div className="flex h-11 w-full items-center rounded-xl border border-[#CDD5E8] bg-[#F8FAFF] px-3 lg:w-[280px]">
              <Search className="h-4 w-4 text-[#697183]" />
              <input
                type="text"
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder="Cari nama, NIM, prodi..."
                className="h-full min-w-0 flex-1 bg-transparent px-3 text-sm font-semibold text-[#202433] outline-none placeholder:text-[#8A90A0]"
              />
            </div>
          </div>

          <div className="p-5">
            {!selectedEvent ? (
              <p className="rounded-xl bg-[#F8FAFF] p-8 text-center text-sm font-semibold text-[#747B8E]">Pilih salah satu kegiatan untuk melihat pendaftar.</p>
            ) : null}

            {selectedEvent && isLoadingRegistrants ? (
              <p className="rounded-xl bg-[#F8FAFF] p-8 text-center text-sm font-semibold text-[#747B8E]">Memuat pendaftar...</p>
            ) : null}

            {selectedEvent && !isLoadingRegistrants && filteredRegistrants.length === 0 ? (
              <p className="rounded-xl bg-[#F8FAFF] p-8 text-center text-sm font-semibold text-[#747B8E]">Belum ada mahasiswa yang sesuai.</p>
            ) : null}

            {selectedEvent && !isLoadingRegistrants && filteredRegistrants.length > 0 ? (
              <div className="space-y-4">
                {filteredRegistrants.map((registrant) => {
                  const statusMeta = getStatusMeta(registrant.status)
                  const isUpdating = updatingId === registrant.id

                  return (
                    <article key={registrant.id} className="rounded-2xl border border-[#E1E6F2] bg-white p-5">
                      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                        <div className="flex min-w-0 gap-4">
                          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#F1F4FF] text-[#0D329D]">
                            <UserRound className="h-6 w-6" strokeWidth={2.4} />
                          </div>
                          <div className="min-w-0">
                            <div className="flex flex-wrap items-center gap-2">
                              <h3 className="text-base font-black text-[#171B29]">{registrant.namaMahasiswa || '-'}</h3>
                              <span className={`rounded-full px-2.5 py-1 text-[11px] font-extrabold ${statusMeta.className}`}>{statusMeta.label}</span>
                            </div>
                            <p className="mt-1 text-sm font-bold text-[#656C7D]">{registrant.nim || '-'} · {registrant.programStudi || '-'}</p>
                            <div className="mt-3 flex flex-wrap gap-3 text-xs font-semibold text-[#6C7486]">
                              <span className="inline-flex items-center gap-1.5"><Mail className="h-3.5 w-3.5" />{registrant.email || '-'}</span>
                              <span className="inline-flex items-center gap-1.5"><Phone className="h-3.5 w-3.5" />{registrant.nomorWhatsApp || '-'}</span>
                            </div>
                            {registrant.alasan ? (
                              <p className="mt-4 rounded-xl bg-[#F8FAFF] px-4 py-3 text-sm font-medium leading-relaxed text-[#4E5363]">{registrant.alasan}</p>
                            ) : null}
                          </div>
                        </div>

                        <div className="flex shrink-0 gap-2 lg:justify-end">
                          <button
                            type="button"
                            disabled={isUpdating || registrant.status === 'DITERIMA'}
                            onClick={() => handleUpdateStatus(registrant.id, 'DITERIMA')}
                            className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-[#159447] px-4 text-xs font-extrabold text-white transition hover:bg-[#0F7A38] disabled:cursor-not-allowed disabled:opacity-55"
                          >
                            <Check className="h-4 w-4" strokeWidth={2.5} />
                            Terima
                          </button>
                          <button
                            type="button"
                            disabled={isUpdating || registrant.status === 'DITOLAK'}
                            onClick={() => handleUpdateStatus(registrant.id, 'DITOLAK')}
                            className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-[#F2B8B8] bg-white px-4 text-xs font-extrabold text-[#B91212] transition hover:bg-[#FFF5F5] disabled:cursor-not-allowed disabled:opacity-55"
                          >
                            <X className="h-4 w-4" strokeWidth={2.5} />
                            Tolak
                          </button>
                        </div>
                      </div>
                    </article>
                  )
                })}
              </div>
            ) : null}
          </div>
        </div>
      </section>
    </EOLayout>
  )
}

function SummaryItem({ label, value, tone }) {
  const toneClass = {
    amber: 'bg-[#FFF7E6] text-[#8F6400]',
    green: 'bg-[#E9F9EF] text-[#137A3A]',
    red: 'bg-[#FFF0F0] text-[#B91212]',
  }[tone]

  return (
    <div className={`rounded-xl px-4 py-3 ${toneClass}`}>
      <p className="text-[11px] font-extrabold uppercase tracking-wide">{label}</p>
      <p className="mt-1 text-2xl font-black">{value}</p>
    </div>
  )
}

export default KelolaPendaftaranPage
