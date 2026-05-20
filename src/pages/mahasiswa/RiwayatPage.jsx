import {
  Award,
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  Clock3,
  Filter,
  History,
  MapPin,
  Search,
  TrendingUp,
} from 'lucide-react'
import DashboardLayout from '../../components/layout/DashboardLayout'

const historyItems = [
  {
    id: 1,
    title: 'Seminar Nasional Teknologi 2024',
    category: 'Seminar',
    date: '15 Mar 2024',
    time: '09.00 - 12.00 WIB',
    location: 'Auditorium Telkom University',
    attendance: 'Hadir',
    points: 10,
  },
  {
    id: 2,
    title: 'Staff Ahli Internal Himpunan',
    category: 'Organisasi',
    date: '10 Feb 2024',
    time: '13.00 - 16.00 WIB',
    location: 'Gedung Fakultas Informatika',
    attendance: 'Hadir',
    points: 25,
  },
  {
    id: 3,
    title: 'Workshop UI/UX Mobile First',
    category: 'Workshop',
    date: '02 Nov 2023',
    time: '13.00 - 15.30 WIB',
    location: 'Lab Komputer 3',
    attendance: 'Hadir',
    points: 10,
  },
  {
    id: 4,
    title: 'Kompetisi Desain Produk Digital',
    category: 'Kompetisi',
    date: '20 Okt 2023',
    time: '08.00 - 17.00 WIB',
    location: 'Telkom University Convention Hall',
    attendance: 'Terverifikasi',
    points: 50,
  },
]

function SummaryCard({ icon: Icon, label, value, helper, tone = 'blue' }) {
  const tones = {
    blue: 'bg-blue-50 text-blue-600',
    green: 'bg-emerald-50 text-emerald-600',
    amber: 'bg-amber-50 text-amber-600',
  }

  return (
    <article className="min-w-[240px] flex-1 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
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

function HistoryCard({ item }) {
  return (
    <article className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-[0_14px_34px_rgba(37,99,235,0.10)]">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex gap-4">
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#EEF4FF] text-blue-600">
            <History className="h-6 w-6" strokeWidth={2.2} />
          </span>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-lg font-bold leading-snug text-gray-900">{item.title}</h3>
              <span className="rounded-full bg-[#EEF2FF] px-3 py-1 text-[10px] font-bold uppercase tracking-wide text-blue-700">
                {item.category}
              </span>
            </div>

            <div className="mt-3 grid gap-2 text-sm text-gray-500 sm:grid-cols-3">
              <span className="flex items-center gap-2">
                <CalendarDays className="h-4 w-4" strokeWidth={2.1} />
                {item.date}
              </span>
              <span className="flex items-center gap-2">
                <Clock3 className="h-4 w-4" strokeWidth={2.1} />
                {item.time}
              </span>
              <span className="flex items-center gap-2">
                <MapPin className="h-4 w-4" strokeWidth={2.1} />
                {item.location}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between gap-4 border-t border-gray-100 pt-4 lg:min-w-[260px] lg:border-l lg:border-t-0 lg:pl-6 lg:pt-0">
          <div>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700">
              <CheckCircle2 className="h-4 w-4" strokeWidth={2.2} />
              {item.attendance}
            </span>
            <p className="mt-2 text-sm font-semibold text-gray-500">Kehadiran tercatat</p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-blue-600">{item.points}</p>
            <p className="text-xs font-bold text-blue-600">Poin TAK</p>
          </div>
        </div>
      </div>
    </article>
  )
}

function RiwayatPage() {
  return (
    <DashboardLayout title="Riwayat">
      <div className="mx-auto max-w-6xl py-6">
        <section className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Riwayat Kegiatan</h1>
            <p className="mt-1 text-sm text-gray-500">
              Pantau kegiatan yang telah kamu ikuti beserta kehadiran dan poin TAK yang diperoleh.
            </p>
          </div>

          <label className="flex h-11 min-w-0 items-center rounded-xl border border-gray-200 bg-white px-3 shadow-sm md:w-[320px]">
            <Search className="h-5 w-5 shrink-0 text-gray-400" strokeWidth={2.1} />
            <input
              type="text"
              placeholder="Cari riwayat kegiatan..."
              className="h-full min-w-0 flex-1 bg-transparent px-3 text-sm text-gray-700 outline-none placeholder:text-gray-400"
            />
          </label>
        </section>

        <section className="mt-6 flex flex-nowrap gap-4 overflow-x-auto pb-1">
          <SummaryCard icon={Award} label="Total Poin TAK" value="450 Poin" helper="+95 tahun ini" />
          <SummaryCard icon={CheckCircle2} label="Kegiatan Selesai" value="18 Kegiatan" helper="100% valid" tone="green" />
          <SummaryCard icon={TrendingUp} label="Progress Target" value="75%" helper="450 / 600" tone="amber" />
        </section>

        <section className="mt-6 overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
          <div className="flex flex-col gap-4 border-b border-gray-100 p-5 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h2 className="text-lg font-bold text-gray-900">Aktivitas Terakhir</h2>
              <p className="mt-1 text-sm text-gray-500">Daftar kehadiran yang sudah diverifikasi.</p>
            </div>

            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                className="inline-flex h-10 items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
              >
                <Filter className="h-4 w-4" strokeWidth={2.2} />
                Semua Kategori
              </button>
              <button
                type="button"
                className="inline-flex h-10 items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
              >
                Tahun 2024
                <ChevronRight className="h-4 w-4 rotate-90" strokeWidth={2.2} />
              </button>
            </div>
          </div>

          <div className="grid gap-4 bg-[#FAFBFF] p-5">
            {historyItems.map((item) => (
              <HistoryCard key={item.id} item={item} />
            ))}
          </div>
        </section>
      </div>
    </DashboardLayout>
  )
}

export default RiwayatPage
