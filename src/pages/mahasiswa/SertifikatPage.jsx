import { useMemo, useState } from 'react'
import {
  Award,
  BookOpenCheck,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  FileCheck2,
  Filter,
  GraduationCap,
  Search,
  Trophy,
  Upload,
} from 'lucide-react'
import DashboardLayout from '../../components/layout/DashboardLayout'

const certificates = [
  {
    id: 1,
    name: 'Seminar Nasional Teknologi 2024',
    type: 'Seminar/Workshop',
    organizer: 'Himpunan Informatika',
    date: '15 Mar 2024',
    points: 10,
    icon: GraduationCap,
    tone: 'blue',
  },
  {
    id: 2,
    name: 'Staff Ahli Internal Himpunan',
    type: 'Organisasi',
    organizer: 'Himpunan Informatika',
    date: '10 Feb 2024',
    points: 25,
    icon: BookOpenCheck,
    tone: 'indigo',
  },
  {
    id: 3,
    name: 'Juara 1 UI/UX Design Competition',
    type: 'Lomba/Kompetisi',
    organizer: 'Universitas Telkom',
    date: '20 Jan 2024',
    points: 50,
    icon: Trophy,
    tone: 'amber',
  },
  {
    id: 4,
    name: 'Relawan Pengajar Desa Digital',
    type: 'Sosmas',
    organizer: 'Direktorat Kemahasiswaan',
    date: '15 Des 2023',
    points: 15,
    icon: FileCheck2,
    tone: 'green',
  },
]

const typeStyles = {
  'Seminar/Workshop': 'bg-[#E8F0FF] text-[#0A4FB8]',
  Organisasi: 'bg-[#F0E9FF] text-[#7141B8]',
  'Lomba/Kompetisi': 'bg-[#FFF1DD] text-[#B15B00]',
  Sosmas: 'bg-[#E8F8EC] text-[#198145]',
}

const iconStyles = {
  blue: 'bg-[#EAF2FF] text-[#0A5ED7]',
  indigo: 'bg-[#EDEBFF] text-[#364AD8]',
  amber: 'bg-[#FFF5DE] text-[#B56A00]',
  green: 'bg-[#E7F8EE] text-[#168447]',
}

const sfProFont = {
  fontFamily:
    "'SF Pro Display', 'SF Pro Text', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
}

function StatCard({ label, value, helper }) {
  return (
    <article className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
      <p className="text-[10px] font-bold uppercase tracking-wider text-gray-500">{label}</p>
      <div className="mt-1.5 flex items-end gap-2">
        <span className="text-xl font-bold leading-none text-gray-900">{value}</span>
        {helper ? <span className="pb-0.5 text-[10px] font-bold text-[#12A24B]">{helper}</span> : null}
      </div>
    </article>
  )
}

function SertifikatPage() {
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('Semua Kategori')
  const [year, setYear] = useState('Tahun 2024')

  const filteredCertificates = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase()

    return certificates.filter((certificate) => {
      const matchesQuery =
        !normalizedQuery ||
        certificate.name.toLowerCase().includes(normalizedQuery) ||
        certificate.organizer.toLowerCase().includes(normalizedQuery)
      const matchesCategory = category === 'Semua Kategori' || certificate.type === category

      return matchesQuery && matchesCategory
    })
  }, [category, query])

  return (
    <DashboardLayout title="Sertifikat Saya">
      <div className="mx-auto max-w-6xl py-6" style={sfProFont}>
        <section className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Sertifikat Saya</h1>
            <p className="mt-1 text-sm text-gray-500">
              Berikut adalah daftar sertifikat kegiatan yang telah Anda selesaikan.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <label className="flex h-11 min-w-0 items-center rounded-lg border border-[#CCD5E4] bg-white px-3 md:w-[360px]">
              <Search className="h-4 w-4 shrink-0 text-[#7C879B]" strokeWidth={2.2} />
              <input
                value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Cari sertifikat atau penyelenggara..."
                className="h-full min-w-0 flex-1 bg-transparent px-3 text-sm text-gray-700 outline-none placeholder:text-gray-400"
              />
            </label>
            <button
              type="button"
              className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"
            >
              <Upload className="h-4 w-4" strokeWidth={2.4} />
              Upload Activity
            </button>
          </div>
        </section>

        <section className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-[200px_200px_minmax(0,1fr)]">
          <StatCard label="Total Sertifikat" value="12" helper="+2 bulan ini" />

          <article className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
            <p className="text-[10px] font-bold uppercase tracking-wider text-gray-500">Total Poin TAK</p>
            <div className="mt-1.5 flex items-end gap-2">
              <span className="text-xl font-bold leading-none text-gray-900">450</span>
              <span className="pb-0.5 text-sm font-semibold text-gray-700">/ 600</span>
            </div>
          </article>

          <article className="relative overflow-hidden rounded-2xl bg-[#2446B8] p-4 text-white shadow-sm md:col-span-2 xl:col-span-1">
            <Award className="absolute -bottom-5 right-3 h-24 w-24 text-white/10" strokeWidth={1.8} />
            <div className="relative">
              <h2 className="text-lg font-bold text-white">Capaian Akademik</h2>
              <p className="mt-1.5 max-w-[520px] text-sm leading-relaxed text-white/75">
                Anda telah mencapai 75% dari target TAK tahun ini. Terus tingkatkan!
              </p>
              <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/25">
                <div className="h-full w-3/4 rounded-full bg-white" />
              </div>
            </div>
          </article>
        </section>

        <section className="mt-5 rounded-2xl border border-gray-100 bg-white shadow-sm">
          <div className="flex flex-col gap-4 border-b border-gray-100 px-5 py-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                <Filter className="h-4 w-4 text-gray-500" strokeWidth={2.2} />
                Filter:
              </div>

              <select
                value={category}
                onChange={(event) => setCategory(event.target.value)}
                className="h-10 rounded-xl border border-gray-200 bg-white px-3 text-sm font-semibold text-gray-700 outline-none focus:border-blue-600"
              >
                <option>Semua Kategori</option>
                <option>Seminar/Workshop</option>
                <option>Organisasi</option>
                <option>Lomba/Kompetisi</option>
                <option>Sosmas</option>
              </select>

              <select
                value={year}
                onChange={(event) => setYear(event.target.value)}
                className="h-10 rounded-xl border border-gray-200 bg-white px-3 text-sm font-semibold text-gray-700 outline-none focus:border-blue-600"
              >
                <option>Tahun 2024</option>
                <option>Tahun 2023</option>
                <option>Tahun 2022</option>
              </select>
            </div>

            <p className="text-xs font-semibold text-gray-700">
              Menampilkan 1-5 dari 12 sertifikat
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[820px] border-collapse">
              <thead>
                <tr className="bg-[#0B3297] text-left text-xs font-bold text-white">
                  <th className="w-[360px] px-6 py-4">Nama Kegiatan</th>
                  <th className="w-[230px] px-6 py-4">Penyelenggara</th>
                  <th className="w-[120px] px-6 py-4">Tanggal Terbit</th>
                  <th className="w-[110px] px-6 py-4">Poin TAK</th>
                  <th className="w-[150px] px-6 py-4 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E5E9F2]">
                {filteredCertificates.map((certificate) => {
                  const Icon = certificate.icon

                  return (
                    <tr key={certificate.id} className="text-sm text-gray-900 transition hover:bg-[#F8FAFF]">
                      <td className="px-6 py-4">
                        <div className="flex items-start gap-4">
                          <span
                            className={`mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-md ${
                              iconStyles[certificate.tone]
                            }`}
                          >
                            <Icon className="h-5 w-5" strokeWidth={2.2} />
                          </span>
                          <div>
                            <p className="font-bold leading-snug">{certificate.name}</p>
                            <span
                              className={`mt-2 inline-flex rounded-full px-2.5 py-1 text-[10px] font-bold ${
                                typeStyles[certificate.type]
                              }`}
                            >
                              {certificate.type}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-500">{certificate.organizer}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-start gap-2 text-gray-500">
                          <CalendarDays className="mt-0.5 h-4 w-4 shrink-0 text-[#7B8496]" strokeWidth={2.1} />
                          <span>{certificate.date}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className="font-bold text-blue-600">{certificate.points}</p>
                        <p className="text-xs font-bold text-blue-600">Poin</p>
                      </td>
                      <td className="px-6 py-4">
                        <button
                          type="button"
                          className="mx-auto inline-flex h-10 min-w-[118px] items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-4 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
                        >
                          <ExternalLink className="h-4 w-4" strokeWidth={2.2} />
                          <span>Lihat Sertifikat</span>
                        </button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          <div className="flex flex-col gap-4 border-t border-gray-100 px-5 py-4 text-xs font-semibold text-gray-500 sm:flex-row sm:items-center sm:justify-between">
            <button
              type="button"
              className="inline-flex h-9 items-center gap-2 rounded-md px-3 text-[#A0A7B5] transition hover:bg-[#F1F5F9] hover:text-[#0B3297]"
            >
              <ChevronLeft className="h-4 w-4" strokeWidth={2.2} />
              Sebelumnya
            </button>

            <div className="flex items-center justify-center gap-2">
              <button type="button" className="h-8 min-w-8 rounded-md bg-[#0B3297] px-3 text-white">
                1
              </button>
              <button type="button" className="h-8 min-w-8 rounded-md px-3 text-[#111827] transition hover:bg-[#F1F5F9]">
                2
              </button>
              <button type="button" className="h-8 min-w-8 rounded-md px-3 text-[#111827] transition hover:bg-[#F1F5F9]">
                3
              </button>
            </div>

            <button
              type="button"
              className="inline-flex h-9 items-center justify-end gap-2 rounded-md px-3 text-[#111827] transition hover:bg-[#F1F5F9] hover:text-[#0B3297]"
            >
              Selanjutnya
              <ChevronRight className="h-4 w-4" strokeWidth={2.2} />
            </button>
          </div>
        </section>
      </div>
    </DashboardLayout>
  )
}

export default SertifikatPage
