import { ArrowLeft, CalendarDays, Clock, Edit3, ImageIcon, MapPin, Ticket, Users } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { checkAuth } from '../../services/authService'
import { getKegiatanDetail } from '../../services/kegiatanService'
import EOLayout from './components/EOLayout'
import { formatDate, formatTime, getBannerUrl, getRegistrantCount, getStatusClass, getStatusLabel } from './detailUtils'

const getStoredUser = () => {
  try {
    return JSON.parse(localStorage.getItem('user')) || null
  } catch {
    return null
  }
}

function InfoItem({ label, value, icon: Icon }) {
  return (
    <div className="rounded-2xl border border-[#E0E5F2] bg-white p-5 shadow-sm">
      <div className="flex items-center gap-3 text-sm font-extrabold text-[#0D329D]">
        <Icon className="h-5 w-5" />
        {label}
      </div>
      <p className="mt-3 text-[18px] font-bold text-[#161A27]">{value || '-'}</p>
    </div>
  )
}

function DetailKegiatanPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [organizerName, setOrganizerName] = useState(getStoredUser()?.name || 'Event Organizer')
  const [event, setEvent] = useState(null)
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
        return getKegiatanDetail(id)
      })
      .then((data) => {
        if (data) setEvent(data)
      })
      .catch((error) => setErrorMessage(error.message || 'Gagal memuat detail kegiatan.'))
      .finally(() => setIsLoading(false))
  }, [id, navigate])

  const bannerUrl = getBannerUrl(event)

  return (
    <EOLayout title="Detail Kegiatan" organizerName={organizerName}>
      <section className="mx-auto max-w-[1120px]">
        <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <button
              type="button"
              onClick={() => navigate('/event-organizer/dashboard')}
              className="mb-5 inline-flex h-10 items-center gap-2 rounded-xl border border-[#CED3E5] bg-white px-4 text-sm font-extrabold text-[#0D329D] shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
            >
              <ArrowLeft className="h-4 w-4" strokeWidth={2.3} />
              Kembali
            </button>
            <h2 className="text-[32px] font-extrabold leading-tight text-[#0D329D]">Detail Kegiatan</h2>
            <p className="mt-2 text-[18px] text-[#555B68]">Lihat informasi kegiatan yang sudah dibuat.</p>
          </div>
          <button
            type="button"
            onClick={() => navigate(`/event-organizer/kegiatan/${id}/edit`)}
            className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-[#0D329D] px-6 text-sm font-extrabold text-white shadow-[0_12px_24px_rgba(13,50,157,0.18)] transition hover:bg-[#09277D]"
          >
            <Edit3 className="h-4 w-4" />
            Edit Kegiatan
          </button>
        </div>

        {errorMessage ? <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-600">{errorMessage}</p> : null}
        {isLoading ? <p className="rounded-2xl bg-white p-8 text-center font-semibold text-[#747B8E]">Memuat detail kegiatan...</p> : null}

        {!isLoading && event ? (
          <div className="grid gap-7">
            <section className="overflow-hidden rounded-[24px] border border-[#E0E5F2] bg-white shadow-[0_18px_45px_rgba(28,42,91,0.06)]">
              <div className="flex min-h-[260px] items-center justify-center bg-[#EEF3FF] text-[#8A90A0]">
                {bannerUrl ? <img src={bannerUrl} alt={event.namaKegiatan} className="h-full max-h-[360px] w-full object-cover" /> : <ImageIcon className="h-14 w-14" />}
              </div>
              <div className="p-7 lg:p-8">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                  <div>
                    <span className={`inline-flex rounded-full px-3 py-1 text-xs font-extrabold ${getStatusClass(event.statusPublikasi)}`}>
                      {getStatusLabel(event.statusPublikasi)}
                    </span>
                    <h3 className="mt-4 text-[30px] font-extrabold leading-tight text-[#161A27]">{event.namaKegiatan}</h3>
                    <p className="mt-3 max-w-3xl text-[17px] leading-relaxed text-[#555B68]">{event.deskripsi}</p>
                  </div>
                  <div className="rounded-2xl bg-[#EEF3FF] px-5 py-4 text-[#0D329D]">
                    <p className="text-sm font-extrabold">Kategori</p>
                    <p className="mt-1 text-xl font-black">{event.kategori}</p>
                  </div>
                </div>
              </div>
            </section>

            <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
              <InfoItem label="Tanggal" value={formatDate(event.tanggal)} icon={CalendarDays} />
              <InfoItem label="Waktu" value={formatTime(event.waktu)} icon={Clock} />
              <InfoItem label="Poin TAK" value={`${event.poinTak ?? 0} poin`} icon={Ticket} />
              <InfoItem label="Pendaftar" value={`${getRegistrantCount(event)} mahasiswa`} icon={Users} />
            </section>

            <section className="rounded-[24px] border border-[#E0E5F2] bg-white p-7 shadow-[0_18px_45px_rgba(28,42,91,0.06)] lg:p-8">
              <div className="flex items-center gap-3 text-sm font-extrabold text-[#0D329D]">
                <MapPin className="h-5 w-5" />
                Lokasi
              </div>
              <p className="mt-3 text-[18px] font-semibold text-[#161A27]">{event.lokasi}</p>
              <div className="mt-6 grid gap-4 md:grid-cols-3">
                <div>
                  <p className="text-sm font-bold text-[#747B8E]">Kuota Peserta</p>
                  <p className="mt-1 text-lg font-extrabold text-[#161A27]">{event.kuotaPeserta ?? '-'}</p>
                </div>
                <div>
                  <p className="text-sm font-bold text-[#747B8E]">Batas Pendaftaran</p>
                  <p className="mt-1 text-lg font-extrabold text-[#161A27]">{formatDate(event.batasPendaftaran)}</p>
                </div>
                <div>
                  <p className="text-sm font-bold text-[#747B8E]">Status Wajib</p>
                  <p className="mt-1 text-lg font-extrabold text-[#161A27]">{event.wajib ? 'Wajib' : 'Tidak Wajib'}</p>
                </div>
              </div>
            </section>
          </div>
        ) : null}
      </section>
    </EOLayout>
  )
}

export default DetailKegiatanPage
