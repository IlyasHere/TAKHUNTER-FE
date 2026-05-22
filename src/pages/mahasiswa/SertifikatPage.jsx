import { Award, CalendarDays, ExternalLink, FileCheck2, Filter, Search, Trophy } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import DashboardLayout from '../../components/layout/DashboardLayout'
import { getMahasiswaSertifikat } from '../../services/sertifikatService'

const formatDate = (value) => {
  if (!value) return '-'

  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value

  return new Intl.DateTimeFormat('id-ID', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(date)
}

const getCertificateName = (certificate) => certificate.namaKegiatan || certificate.name || '-'
const getCertificateCategory = (certificate) => certificate.kategori || certificate.category || 'Umum'
const getCertificateOrganizer = (certificate) => certificate.penyelenggara || certificate.organizer || '-'
const getCertificatePoints = (certificate) => Number(certificate.poinTak ?? certificate.points ?? 0)

function StatCard({ label, value, helper, icon: Icon }) {
  return (
    <article className="group relative overflow-hidden rounded-2xl border border-[#DDE4F0] bg-white p-5 shadow-[0_12px_30px_rgba(20,36,82,0.05)] transition duration-300 hover:-translate-y-1 hover:border-[#B9C8F5] hover:shadow-[0_22px_46px_rgba(13,50,157,0.12)]">
      <div className="relative flex items-center justify-between gap-4">
        <div>
          <p className="text-[11px] font-black uppercase tracking-wide text-[#7A8191]">{label}</p>
          <p className="mt-2 text-3xl font-black leading-none text-[#171B29] transition group-hover:text-[#0D329D]">{value}</p>
          {helper ? <p className="mt-2 text-xs font-bold text-[#168148]">{helper}</p> : null}
        </div>
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#E8EDFF] text-[#0D329D] transition group-hover:scale-105">
          <Icon className="h-6 w-6" strokeWidth={2.4} />
        </div>
      </div>
    </article>
  )
}

function SertifikatPage() {
  const navigate = useNavigate()
  const [certificates, setCertificates] = useState([])
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('Semua Kategori')
  const [isLoading, setIsLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    getMahasiswaSertifikat()
      .then((data) => {
        setCertificates(data)
      })
      .catch((error) => {
        if (error.status === 401) {
          localStorage.removeItem('token')
          localStorage.removeItem('user')
          navigate('/login', { replace: true })
          return
        }

        setErrorMessage(error.message || 'Gagal memuat sertifikat.')
      })
      .finally(() => {
        setIsLoading(false)
      })
  }, [navigate])

  const categories = useMemo(() => {
    const uniqueCategories = [...new Set(certificates.map(getCertificateCategory).filter(Boolean))]
    return ['Semua Kategori', ...uniqueCategories]
  }, [certificates])

  const filteredCertificates = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase()

    return certificates.filter((certificate) => {
      const matchesQuery =
        !normalizedQuery ||
        getCertificateName(certificate).toLowerCase().includes(normalizedQuery) ||
        getCertificateOrganizer(certificate).toLowerCase().includes(normalizedQuery)
      const matchesCategory = category === 'Semua Kategori' || getCertificateCategory(certificate) === category

      return matchesQuery && matchesCategory
    })
  }, [certificates, category, query])

  const totalPoints = certificates.reduce((sum, certificate) => sum + getCertificatePoints(certificate), 0)

  const handleOpenCertificate = (driveLink) => {
    if (!driveLink) return
    window.open(driveLink, '_blank', 'noopener,noreferrer')
  }

  return (
    <DashboardLayout title="Sertifikat Saya">
      <div className="mx-auto max-w-6xl py-6">
        <section className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-[30px] font-black leading-tight text-[#171B29]">Sertifikat Saya</h1>
            <p className="mt-2 text-sm font-semibold text-[#687085]">
              Berikut adalah daftar sertifikat kegiatan yang sudah diterbitkan oleh Event Organizer.
            </p>
          </div>

          <label className="flex h-12 min-w-0 items-center rounded-xl border border-[#CCD5E4] bg-white px-3 shadow-[0_10px_24px_rgba(31,41,55,0.04)] md:w-[360px]">
            <Search className="h-5 w-5 shrink-0 text-[#7C879B]" strokeWidth={2.2} />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Cari sertifikat atau penyelenggara..."
              className="h-full min-w-0 flex-1 bg-transparent px-3 text-sm font-semibold text-gray-700 outline-none placeholder:text-gray-400"
            />
          </label>
        </section>

        <section className="mt-6 grid gap-4 md:grid-cols-3">
          <StatCard label="Total Sertifikat" value={certificates.length} icon={Award} />
          <StatCard label="Total Poin TAK" value={totalPoints.toLocaleString('id-ID')} icon={Trophy} />
          <article className="relative overflow-hidden rounded-2xl bg-[#0D329D] p-5 text-white shadow-[0_18px_38px_rgba(13,50,157,0.20)]">
            <Award className="absolute -bottom-5 right-3 h-24 w-24 text-white/10" strokeWidth={1.8} />
            <div className="relative">
              <h2 className="text-lg font-black text-white">Riwayat TAK</h2>
              <p className="mt-2 max-w-[360px] text-sm font-semibold leading-relaxed text-white/75">
                Poin TAK otomatis masuk saat sertifikat kegiatan diterbitkan oleh EO.
              </p>
            </div>
          </article>
        </section>

        <section className="mt-6 overflow-hidden rounded-2xl border border-[#DDE4F0] bg-white shadow-[0_14px_36px_rgba(20,36,82,0.06)]">
          <div className="flex flex-col gap-4 border-b border-[#E5E9F2] px-5 py-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-2 text-sm font-black text-[#4B5161]">
                <Filter className="h-4 w-4 text-[#0D329D]" strokeWidth={2.3} />
                Filter
              </div>

              <select
                value={category}
                onChange={(event) => setCategory(event.target.value)}
                className="h-10 rounded-xl border border-[#D8E0F2] bg-white px-3 text-sm font-bold text-[#4B5161] outline-none focus:border-[#0D329D]"
              >
                {categories.map((item) => (
                  <option key={item}>{item}</option>
                ))}
              </select>
            </div>

            <p className="text-xs font-bold text-[#687085]">
              Menampilkan {filteredCertificates.length} dari {certificates.length} sertifikat
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[860px] border-collapse">
              <thead>
                <tr className="bg-[#0D329D] text-left text-xs font-black uppercase tracking-wide text-white">
                  <th className="w-[360px] px-6 py-4">Nama Kegiatan</th>
                  <th className="w-[220px] px-6 py-4">Penyelenggara</th>
                  <th className="w-[150px] px-6 py-4">Tanggal Terbit</th>
                  <th className="w-[120px] px-6 py-4">Poin TAK</th>
                  <th className="w-[130px] px-6 py-4">Status</th>
                  <th className="w-[170px] px-6 py-4 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E5E9F2]">
                {isLoading ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-sm font-semibold text-[#747B8E]">Memuat sertifikat...</td>
                  </tr>
                ) : null}

                {!isLoading && errorMessage ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-sm font-semibold text-red-600">{errorMessage}</td>
                  </tr>
                ) : null}

                {!isLoading && !errorMessage && filteredCertificates.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-14 text-center">
                      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#EEF3FF] text-[#0D329D]">
                        <FileCheck2 className="h-7 w-7" strokeWidth={2.3} />
                      </div>
                      <p className="mt-4 text-base font-black text-[#171B29]">Belum ada sertifikat</p>
                      <p className="mt-1 text-sm font-semibold text-[#747B8E]">Sertifikat yang diterbitkan EO akan muncul di sini.</p>
                    </td>
                  </tr>
                ) : null}

                {!isLoading && !errorMessage ? filteredCertificates.map((certificate) => (
                  <tr key={certificate.id} className="text-sm text-gray-900 transition hover:bg-[#F8FAFF]">
                    <td className="px-6 py-5">
                      <div className="flex items-start gap-4">
                        <span className="mt-1 flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#EAF2FF] text-[#0D329D]">
                          <Award className="h-5 w-5" strokeWidth={2.3} />
                        </span>
                        <div>
                          <p className="font-black leading-snug text-[#171B29]">{getCertificateName(certificate)}</p>
                          <span className="mt-2 inline-flex rounded-full bg-[#E8F0FF] px-2.5 py-1 text-[10px] font-black text-[#0A4FB8]">
                            {getCertificateCategory(certificate)}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5 font-semibold text-[#5E6677]">{getCertificateOrganizer(certificate)}</td>
                    <td className="px-6 py-5">
                      <div className="flex items-start gap-2 text-[#5E6677]">
                        <CalendarDays className="mt-0.5 h-4 w-4 shrink-0 text-[#7B8496]" strokeWidth={2.1} />
                        <span>{formatDate(certificate.issuedAt || certificate.tanggalKegiatan)}</span>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <p className="font-black text-[#0D329D]">{getCertificatePoints(certificate)}</p>
                      <p className="text-xs font-black text-[#0D329D]">Poin</p>
                    </td>
                    <td className="px-6 py-5">
                      <span className="inline-flex rounded-full bg-[#EAF7F0] px-3 py-1 text-xs font-black text-[#168148]">
                        {certificate.status || 'TERBIT'}
                      </span>
                    </td>
                    <td className="px-6 py-5">
                      <button
                        type="button"
                        onClick={() => handleOpenCertificate(certificate.driveLink)}
                        disabled={!certificate.driveLink}
                        className="mx-auto inline-flex h-10 min-w-[132px] items-center justify-center gap-2 rounded-xl border border-[#D8E0F2] bg-white px-4 text-sm font-bold text-[#0D329D] transition hover:bg-[#EEF3FF] disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        <ExternalLink className="h-4 w-4" strokeWidth={2.2} />
                        <span>Buka Sertifikat</span>
                      </button>
                    </td>
                  </tr>
                )) : null}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </DashboardLayout>
  )
}

export default SertifikatPage
