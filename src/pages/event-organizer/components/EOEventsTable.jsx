import { CalendarDays, ChevronLeft, ChevronRight, Eye, ImageIcon, ListFilter, Pencil, Trash2 } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { API_BASE_URL } from '../../../lib/api'

const buildAssetUrl = (value) => {
  if (!value) return ''
  if (value.startsWith('http://') || value.startsWith('https://') || value.startsWith('data:')) return value

  const baseUrl = API_BASE_URL?.replace(/\/$/, '') || ''
  const path = value.startsWith('/') ? value : `/${value}`

  return `${baseUrl}${path}`
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
  const normalizedStatus = status || 'DRAFT'

  if (normalizedStatus === 'AKTIF') {
    return {
      label: 'Aktif',
      statusClass: 'bg-[#DFF7E8] text-[#159447]',
      dotClass: 'bg-[#16B354]',
    }
  }

  if (normalizedStatus === 'SELESAI') {
    return {
      label: 'Selesai',
      statusClass: 'bg-[#DCEAFF] text-[#1459D8]',
      dotClass: 'bg-[#1D64F2]',
    }
  }

  return {
    label: 'Draft',
    statusClass: 'bg-[#E0E3E6] text-[#555B68]',
    dotClass: 'bg-[#7B8190]',
  }
}

const mapEvent = (event) => {
  const statusMeta = getStatusMeta(event.statusPublikasi || event.status)

  return {
    id: event.id,
    name: event.namaKegiatan || event.name || '-',
    points: `${event.poinTak ?? event.pointTak ?? 0} TAK Points`,
    category: event.kategori || '-',
    date: formatDate(event.tanggal),
    registrants: event.jumlahPendaftar ?? event.pendaftar ?? event.registrants ?? 0,
    bannerUrl: buildAssetUrl(event.bannerPath || event.bannerUrl || event.banner || event.gambarUrl || event.imageUrl),
    ...statusMeta,
  }
}

function EOEventsTable({ events = [], isLoading = false, errorMessage = '', onDelete }) {
  const navigate = useNavigate()
  const mappedEvents = events.map(mapEvent)

  return (
    <section className="overflow-hidden rounded-2xl border border-[#D6DCEE] bg-white shadow-[0_12px_34px_rgba(20,36,82,0.06)]">
      <div className="flex flex-col gap-4 px-6 py-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-col gap-4 sm:flex-row">
          <button className="flex h-12 w-full items-center justify-between rounded-xl border border-[#CDD5E8] bg-[#F8FAFF] px-4 text-sm font-extrabold text-[#222835] shadow-sm transition hover:border-[#AEBBE0] hover:bg-white sm:w-[256px]" type="button">
            <span className="flex items-center gap-3">
              <ListFilter className="h-4 w-4 text-[#606779]" />
              Semua Kategori
            </span>
            <ChevronRight className="h-4 w-4 rotate-90 text-[#606779]" />
          </button>
          <button className="flex h-12 w-full items-center justify-between rounded-xl border border-[#CDD5E8] bg-[#F8FAFF] px-4 text-sm font-extrabold text-[#222835] shadow-sm transition hover:border-[#AEBBE0] hover:bg-white sm:w-[256px]" type="button">
            <span className="flex items-center gap-3">
              <CalendarDays className="h-4 w-4 text-[#606779]" />
              Urutkan Tanggal
            </span>
            <ChevronRight className="h-4 w-4 rotate-90 text-[#606779]" />
          </button>
        </div>
        <p className="rounded-full bg-[#F1F4FF] px-4 py-2 text-xs font-extrabold text-[#4E5363]">Menampilkan {mappedEvents.length} kegiatan</p>
      </div>

      {errorMessage ? (
        <div className="mx-6 mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-600">
          {errorMessage}
        </div>
      ) : null}

      <div className="overflow-x-auto">
        <table className="w-full min-w-[900px] border-collapse">
          <thead>
            <tr className="h-16 bg-[#0D329D] text-left text-[16px] font-extrabold uppercase tracking-wide text-white">
              <th className="px-8">Nama Kegiatan</th>
              <th className="px-4">Kategori</th>
              <th className="px-4">Tanggal</th>
              <th className="px-4">Pendaftar</th>
              <th className="px-4">Status</th>
              <th className="px-8 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan="6" className="px-8 py-12 text-center text-sm font-semibold text-[#747B8E]">
                  Memuat data kegiatan...
                </td>
              </tr>
            ) : null}

            {!isLoading && mappedEvents.length === 0 ? (
              <tr>
                <td colSpan="6" className="px-8 py-12 text-center text-sm font-semibold text-[#747B8E]">
                  Belum ada kegiatan. Klik Tambah Kegiatan Baru untuk membuat kegiatan pertama.
                </td>
              </tr>
            ) : null}

            {!isLoading && mappedEvents.map((event) => (
              <tr key={event.id} className="group border-b border-[#E1E6F2] bg-white transition duration-200 hover:bg-[#F6F9FF] hover:shadow-[inset_4px_0_0_#0D329D]">
                <td className="px-8 py-7">
                  <div className="flex items-center gap-6">
                    <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-[#E4E8F3] bg-[#F6F7FA] text-[#8A90A0] transition duration-200 group-hover:scale-105 group-hover:bg-white group-hover:shadow-sm">
                      {event.bannerUrl ? (
                        <img className="h-full w-full object-cover" src={event.bannerUrl} alt="" />
                      ) : null}
                      {!event.bannerUrl ? <ImageIcon className="h-5 w-5" /> : null}
                    </div>
                    <div>
                      <p className="max-w-[150px] text-[17px] font-extrabold leading-tight text-[#171B29] transition group-hover:text-[#0D329D]">{event.name}</p>
                      <p className="mt-1 text-xs font-extrabold text-[#0D329D]">{event.points}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-7">
                  <span className="rounded-full bg-[#DCEAFF] px-3 py-1.5 text-xs font-extrabold text-[#174EAA]">{event.category}</span>
                </td>
                <td className="px-4 py-7 text-[16px] font-medium text-[#3F4555]">{event.date}</td>
                <td className="px-4 py-7">
                  <p className="text-[17px] font-extrabold text-[#171B29]">{event.registrants}</p>
                  <p className="mt-1 text-[11px] font-bold text-[#B7BDCC]">Mahasiswa</p>
                </td>
                <td className="px-4 py-7">
                  <span className={`inline-flex items-center gap-1.5 rounded px-2 py-1 text-xs font-extrabold ${event.statusClass}`}>
                    <span className={`h-1.5 w-1.5 rounded-full ${event.dotClass}`} />
                    {event.label}
                  </span>
                </td>
                <td className="px-8 py-7">
                  <div className="flex items-center justify-end gap-5">
                    <button className="flex h-10 w-10 items-center justify-center rounded-xl text-[#0D329D] transition hover:bg-[#EAF1FF]" type="button" aria-label="Edit kegiatan" onClick={() => navigate(`/event-organizer/kegiatan/${event.id}/edit`)}>
                      <Pencil className="h-5 w-5" strokeWidth={2.3} />
                    </button>
                    <button className="flex h-10 w-10 items-center justify-center rounded-xl text-[#3E4554] transition hover:bg-[#F1F4F9]" type="button" aria-label="Lihat kegiatan" onClick={() => navigate(`/event-organizer/kegiatan/${event.id}`)}>
                      <Eye className="h-5 w-5" strokeWidth={2.3} />
                    </button>
                    <button className="flex h-10 w-10 items-center justify-center rounded-xl text-[#DC1717] transition hover:bg-[#FFF0F0]" type="button" aria-label="Hapus kegiatan" onClick={() => onDelete?.(event.id)}>
                      <Trash2 className="h-5 w-5" strokeWidth={2.3} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between border-t border-[#E1E6F2] bg-[#FAFBFF] px-6 py-5">
        <p className="text-xs font-semibold text-[#3E4554]">Halaman 1 dari 1</p>
        <div className="flex items-center gap-2">
          <button className="flex h-9 w-7 items-center justify-center rounded border border-[#E2E5EF] text-[#C8CEDB]" type="button">
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button className="h-11 w-8 rounded bg-[#0D329D] text-sm font-extrabold text-white" type="button">1</button>
          <button className="h-11 w-8 rounded text-sm font-medium text-[#171B29]" type="button">2</button>
          <button className="h-11 w-8 rounded text-sm font-medium text-[#171B29]" type="button">3</button>
          <button className="flex h-9 w-7 items-center justify-center rounded border border-[#C8CEE0] text-[#171B29]" type="button">
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>
    </section>
  )
}

export default EOEventsTable
