import { CalendarDays, CheckCircle2, Clock3, Mail, MapPin, Phone, Search, UserRound, Users } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { checkAuth } from '../../services/authService'
import { getRiwayatEOPeserta } from '../../services/pendaftaranService'
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

const formatTime = (value) => {
  if (!value) return '-'
  return `${String(value).slice(0, 5).replace(':', '.')} WIB`
}

function groupByKegiatan(items) {
  const groups = new Map()

  items.forEach((item) => {
    const key = item.kegiatanId || `unknown-${item.id}`
    const currentGroup = groups.get(key) || {
      kegiatanId: item.kegiatanId,
      namaKegiatan: item.namaKegiatan || '-',
      kategori: item.kategori || '-',
      tanggal: item.tanggal,
      waktu: item.waktu,
      lokasi: item.lokasi,
      poinTak: item.poinTak ?? 0,
      peserta: [],
    }

    currentGroup.peserta.push(item)
    groups.set(key, currentGroup)
  })

  return Array.from(groups.values())
}

function RiwayatEOPage() {
  const navigate = useNavigate()
  const [organizerName, setOrganizerName] = useState(getStoredUser()?.name || 'Event Organizer')
  const [acceptedParticipants, setAcceptedParticipants] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState('')

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

        return getRiwayatEOPeserta()
      })
      .then((items) => {
        if (items) setAcceptedParticipants(items)
      })
      .catch((error) => {
        setErrorMessage(error.message || 'Gagal memuat riwayat peserta.')
      })
      .finally(() => {
        setIsLoading(false)
      })
  }, [navigate])

  const groupedEvents = useMemo(() => {
    const query = searchQuery.trim().toLowerCase()
    const groups = groupByKegiatan(acceptedParticipants)

    if (!query) return groups

    return groups
      .map((group) => ({
        ...group,
        peserta: group.peserta.filter((participant) =>
          [
            group.namaKegiatan,
            group.kategori,
            participant.namaMahasiswa,
            participant.nim,
            participant.programStudi,
            participant.email,
          ].some((value) => String(value || '').toLowerCase().includes(query)),
        ),
      }))
      .filter((group) => group.peserta.length > 0)
  }, [acceptedParticipants, searchQuery])

  const totalEvents = groupByKegiatan(acceptedParticipants).length

  return (
    <EOLayout title="Riwayat" organizerName={organizerName}>
      <section className="mb-6 rounded-2xl border border-[#D8E0F2] bg-white p-6 shadow-[0_12px_34px_rgba(20,36,82,0.06)]">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="inline-flex items-center gap-2 rounded-full bg-[#E9F9EF] px-3 py-1.5 text-xs font-extrabold text-[#137A3A]">
              <CheckCircle2 className="h-4 w-4" strokeWidth={2.4} />
              Peserta Diterima
            </p>
            <h2 className="mt-4 text-[30px] font-black leading-tight text-[#171B29]">Riwayat Kegiatan EO</h2>
            <p className="mt-2 max-w-2xl text-sm font-semibold leading-relaxed text-[#656C7D]">
              Lihat kegiatan yang kamu buat beserta daftar peserta yang sudah diterima.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:min-w-[320px]">
            <SummaryBox label="Kegiatan" value={totalEvents} />
            <SummaryBox label="Peserta Diterima" value={acceptedParticipants.length} />
          </div>
        </div>
      </section>

      <section className="overflow-hidden rounded-2xl border border-[#D8E0F2] bg-white shadow-[0_12px_34px_rgba(20,36,82,0.06)]">
        <div className="flex flex-col gap-4 border-b border-[#E3E8F4] px-5 py-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm font-black text-[#171B29]">Daftar Peserta per Kegiatan</p>
            <p className="mt-1 text-xs font-bold text-[#7A8298]">Hanya menampilkan pendaftaran dengan status Diterima.</p>
          </div>

          <div className="flex h-11 w-full items-center rounded-xl border border-[#CDD5E8] bg-[#F8FAFF] px-3 lg:w-[340px]">
            <Search className="h-4 w-4 text-[#697183]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="Cari kegiatan, peserta, NIM..."
              className="h-full min-w-0 flex-1 bg-transparent px-3 text-sm font-semibold text-[#202433] outline-none placeholder:text-[#8A90A0]"
            />
          </div>
        </div>

        {errorMessage ? (
          <div className="mx-5 mt-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-600">
            {errorMessage}
          </div>
        ) : null}

        <div className="grid gap-5 bg-[#FAFBFF] p-5">
          {isLoading ? (
            <p className="rounded-2xl bg-white p-8 text-center text-sm font-semibold text-[#747B8E]">Memuat riwayat peserta...</p>
          ) : null}

          {!isLoading && groupedEvents.length === 0 ? (
            <p className="rounded-2xl bg-white p-8 text-center text-sm font-semibold text-[#747B8E]">Belum ada peserta yang diterima.</p>
          ) : null}

          {!isLoading && groupedEvents.map((event) => (
            <article key={event.kegiatanId || event.namaKegiatan} className="overflow-hidden rounded-2xl border border-[#E1E6F2] bg-white">
              <div className="border-b border-[#E8ECF5] bg-white px-5 py-4">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-lg font-black text-[#171B29]">{event.namaKegiatan}</h3>
                      <span className="rounded-full bg-[#DCEAFF] px-3 py-1 text-[11px] font-extrabold text-[#174EAA]">{event.kategori}</span>
                    </div>
                    <div className="mt-3 flex flex-wrap gap-3 text-xs font-bold text-[#6C7486]">
                      <span className="inline-flex items-center gap-1.5"><CalendarDays className="h-3.5 w-3.5" />{formatDate(event.tanggal)}</span>
                      <span className="inline-flex items-center gap-1.5"><Clock3 className="h-3.5 w-3.5" />{formatTime(event.waktu)}</span>
                      <span className="inline-flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5" />{event.lokasi || '-'}</span>
                    </div>
                  </div>
                  <div className="inline-flex items-center gap-2 rounded-xl bg-[#E9F9EF] px-4 py-2 text-sm font-black text-[#137A3A]">
                    <Users className="h-4 w-4" strokeWidth={2.4} />
                    {event.peserta.length} peserta
                  </div>
                </div>
              </div>

              <div className="divide-y divide-[#EEF1F7]">
                {event.peserta.map((participant) => (
                  <div key={participant.id} className="flex flex-col gap-4 px-5 py-4 lg:flex-row lg:items-center lg:justify-between">
                    <div className="flex gap-4">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#F1F4FF] text-[#0D329D]">
                        <UserRound className="h-5 w-5" strokeWidth={2.4} />
                      </div>
                      <div>
                        <p className="font-black text-[#171B29]">{participant.namaMahasiswa || '-'}</p>
                        <p className="mt-1 text-sm font-bold text-[#656C7D]">{participant.nim || '-'} - {participant.programStudi || '-'}</p>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-3 text-xs font-semibold text-[#6C7486] lg:justify-end">
                      <span className="inline-flex items-center gap-1.5"><Mail className="h-3.5 w-3.5" />{participant.email || '-'}</span>
                      <span className="inline-flex items-center gap-1.5"><Phone className="h-3.5 w-3.5" />{participant.nomorWhatsApp || '-'}</span>
                    </div>
                  </div>
                ))}
              </div>
            </article>
          ))}
        </div>
      </section>
    </EOLayout>
  )
}

function SummaryBox({ label, value }) {
  return (
    <div className="rounded-xl bg-[#F4F7FF] px-4 py-3 text-[#0D329D]">
      <p className="text-[11px] font-extrabold uppercase tracking-wide">{label}</p>
      <p className="mt-1 text-2xl font-black">{value}</p>
    </div>
  )
}

export default RiwayatEOPage
