import {
  Award,
  CalendarDays,
  CheckCircle2,
  Clock3,
  Eye,
  History,
  Mail,
  MapPin,
  Phone,
  Search,
  TimerReset,
  XCircle,
} from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import DashboardLayout from '../../components/layout/DashboardLayout'
import { getPendaftaranSaya } from '../../services/pendaftaranService'

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

const getStatusMeta = (status) => {
  if (status === 'DITERIMA') {
    return {
      label: 'Diterima',
      icon: CheckCircle2,
      className: 'bg-emerald-50 text-emerald-700',
      helper: 'Pendaftaran sudah di-ACC EO',
    }
  }

  if (status === 'DITOLAK') {
    return {
      label: 'Ditolak',
      icon: XCircle,
      className: 'bg-red-50 text-red-700',
      helper: 'Pendaftaran tidak disetujui',
    }
  }

  return {
    label: 'Menunggu',
    icon: TimerReset,
    className: 'bg-amber-50 text-amber-700',
    helper: 'Menunggu keputusan EO',
  }
}

function SummaryCard({ icon: Icon, label, value, helper, tone = 'blue' }) {
  const tones = {
    blue: 'bg-blue-50 text-blue-600',
    green: 'bg-emerald-50 text-emerald-600',
    amber: 'bg-amber-50 text-amber-600',
  }

  return (
    <article className="min-w-[220px] flex-1 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between gap-4">
        <span className={`flex h-12 w-12 items-center justify-center rounded-2xl ${tones[tone]}`}>
          <Icon className="h-6 w-6" strokeWidth={2.2} />
        </span>
        <span className="text-right text-[10px] font-bold uppercase tracking-wider text-gray-400">{helper}</span>
      </div>
      <p className="mt-5 text-sm font-semibold text-gray-500">{label}</p>
      <p className="mt-1 text-2xl font-bold text-gray-900">{value}</p>
    </article>
  )
}

function HistoryCard({ item, onDetail }) {
  const statusMeta = getStatusMeta(item.status)
  const StatusIcon = statusMeta.icon

  return (
    <article className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-[0_14px_34px_rgba(37,99,235,0.10)]">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex gap-4">
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#EEF4FF] text-blue-600">
            <History className="h-6 w-6" strokeWidth={2.2} />
          </span>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-lg font-bold leading-snug text-gray-900">{item.namaKegiatan || '-'}</h3>
              <span className="rounded-full bg-[#EEF2FF] px-3 py-1 text-[10px] font-bold uppercase tracking-wide text-blue-700">
                {item.kategori || '-'}
              </span>
            </div>

            <div className="mt-3 grid gap-2 text-sm text-gray-500 sm:grid-cols-3">
              <span className="flex items-center gap-2">
                <CalendarDays className="h-4 w-4" strokeWidth={2.1} />
                {formatDate(item.tanggal)}
              </span>
              <span className="flex items-center gap-2">
                <Clock3 className="h-4 w-4" strokeWidth={2.1} />
                {formatTime(item.waktu)}
              </span>
              <span className="flex items-center gap-2">
                <MapPin className="h-4 w-4" strokeWidth={2.1} />
                {item.lokasi || '-'}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between gap-4 border-t border-gray-100 pt-4 lg:min-w-[300px] lg:border-l lg:border-t-0 lg:pl-6 lg:pt-0">
          <div>
            <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold ${statusMeta.className}`}>
              <StatusIcon className="h-4 w-4" strokeWidth={2.2} />
              {statusMeta.label}
            </span>
            <p className="mt-2 text-sm font-semibold text-gray-500">{statusMeta.helper}</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-right">
              <p className="text-2xl font-bold text-blue-600">{item.poinTak ?? 0}</p>
              <p className="text-xs font-bold text-blue-600">Poin TAK</p>
            </div>
            <button
              type="button"
              onClick={() => onDetail(item)}
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-gray-200 text-gray-600 transition hover:bg-gray-50 hover:text-blue-600"
              aria-label="Lihat detail pendaftaran"
            >
              <Eye className="h-5 w-5" strokeWidth={2.2} />
            </button>
          </div>
        </div>
      </div>
    </article>
  )
}

function DetailModal({ item, onClose }) {
  if (!item) return null

  const statusMeta = getStatusMeta(item.status)

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/45 px-4 py-6 backdrop-blur-sm">
      <div className="w-full max-w-2xl overflow-hidden rounded-3xl bg-white shadow-[0_28px_80px_rgba(17,24,39,0.28)]">
        <div className="border-b border-gray-100 px-6 py-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-wide text-blue-600">Detail Pendaftaran</p>
              <h3 className="mt-2 text-2xl font-black text-gray-900">{item.namaKegiatan || '-'}</h3>
            </div>
            <button type="button" onClick={onClose} className="rounded-xl border border-gray-200 px-4 py-2 text-sm font-bold text-gray-600 hover:bg-gray-50">
              Tutup
            </button>
          </div>
        </div>

        <div className="grid gap-4 p-6 sm:grid-cols-2">
          <Info label="Status" value={statusMeta.label} />
          <Info label="Event Organizer" value={item.eventOrganizerName || '-'} />
          <Info label="Tanggal" value={formatDate(item.tanggal)} />
          <Info label="Waktu" value={formatTime(item.waktu)} />
          <Info label="Lokasi" value={item.lokasi || '-'} />
          <Info label="Poin TAK" value={`${item.poinTak ?? 0} Poin`} />
          <Info label="Email" value={item.email || '-'} icon={Mail} />
          <Info label="WhatsApp" value={item.nomorWhatsApp || '-'} icon={Phone} />
          <div className="sm:col-span-2 rounded-2xl bg-[#F8FAFF] p-4">
            <p className="text-xs font-bold uppercase tracking-wide text-gray-400">Alasan Mendaftar</p>
            <p className="mt-2 text-sm font-semibold leading-relaxed text-gray-700">{item.alasan || '-'}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

function Info({ label, value, icon: Icon }) {
  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-4">
      <p className="text-xs font-bold uppercase tracking-wide text-gray-400">{label}</p>
      <p className="mt-2 flex items-center gap-2 text-sm font-bold text-gray-900">
        {Icon ? <Icon className="h-4 w-4 text-blue-600" /> : null}
        {value}
      </p>
    </div>
  )
}

function RiwayatPage() {
  const navigate = useNavigate()
  const [historyItems, setHistoryItems] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedItem, setSelectedItem] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    if (!localStorage.getItem('token')) {
      navigate('/login', { replace: true })
      return
    }

    getPendaftaranSaya()
      .then(setHistoryItems)
      .catch((error) => {
        setErrorMessage(error.message || 'Gagal memuat riwayat pendaftaran.')
      })
      .finally(() => {
        setIsLoading(false)
      })
  }, [navigate])

  const filteredItems = useMemo(() => {
    const query = searchQuery.trim().toLowerCase()
    if (!query) return historyItems

    return historyItems.filter((item) =>
      [item.namaKegiatan, item.kategori, item.status, item.lokasi]
        .some((value) => String(value || '').toLowerCase().includes(query)),
    )
  }, [historyItems, searchQuery])

  const acceptedItems = historyItems.filter((item) => item.status === 'DITERIMA')
  const pendingItems = historyItems.filter((item) => item.status === 'PENDING' || !item.status)
  const acceptedPoints = acceptedItems.reduce((sum, item) => sum + Number(item.poinTak || 0), 0)

  return (
    <DashboardLayout title="Riwayat">
      <DetailModal item={selectedItem} onClose={() => setSelectedItem(null)} />
      <div className="mx-auto max-w-6xl py-6">
        <section className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Riwayat Pendaftaran</h1>
            <p className="mt-1 text-sm text-gray-500">
              Pantau kegiatan yang kamu daftar, status ACC dari EO, dan detail pendaftaranmu.
            </p>
          </div>

          <label className="flex h-11 min-w-0 items-center rounded-xl border border-gray-200 bg-white px-3 shadow-sm md:w-[320px]">
            <Search className="h-5 w-5 shrink-0 text-gray-400" strokeWidth={2.1} />
            <input
              type="text"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="Cari riwayat kegiatan..."
              className="h-full min-w-0 flex-1 bg-transparent px-3 text-sm text-gray-700 outline-none placeholder:text-gray-400"
            />
          </label>
        </section>

        <section className="mt-6 flex flex-nowrap gap-4 overflow-x-auto pb-1">
          <SummaryCard icon={Award} label="Poin Disetujui" value={`${acceptedPoints} Poin`} helper="status diterima" />
          <SummaryCard icon={CheckCircle2} label="Kegiatan Diterima" value={`${acceptedItems.length} Kegiatan`} helper="sudah ACC" tone="green" />
          <SummaryCard icon={TimerReset} label="Menunggu ACC" value={`${pendingItems.length} Kegiatan`} helper="belum final" tone="amber" />
        </section>

        {errorMessage ? (
          <p className="mt-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-600">{errorMessage}</p>
        ) : null}

        <section className="mt-6 overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
          <div className="border-b border-gray-100 p-5">
            <h2 className="text-lg font-bold text-gray-900">Kegiatan yang Didaftar</h2>
            <p className="mt-1 text-sm text-gray-500">Menampilkan {filteredItems.length} dari {historyItems.length} pendaftaran.</p>
          </div>

          <div className="grid gap-4 bg-[#FAFBFF] p-5">
            {isLoading ? (
              <p className="rounded-2xl bg-white p-8 text-center text-sm font-semibold text-gray-500">Memuat riwayat pendaftaran...</p>
            ) : null}

            {!isLoading && filteredItems.length === 0 ? (
              <p className="rounded-2xl bg-white p-8 text-center text-sm font-semibold text-gray-500">Belum ada riwayat pendaftaran.</p>
            ) : null}

            {!isLoading && filteredItems.map((item) => (
              <HistoryCard key={item.id} item={item} onDetail={setSelectedItem} />
            ))}
          </div>
        </section>
      </div>
    </DashboardLayout>
  )
}

export default RiwayatPage
