import {
  Award,
  CalendarDays,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Cloud,
  Download,
  FileText,
  Filter,
  Link,
  ListChecks,
  LockKeyhole,
  MapPin,
  Search,
  Send,
  ShieldCheck,
  ToggleRight,
  UsersRound,
} from 'lucide-react'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import Toast from '../../components/ui/Toast'
import { checkAuth } from '../../services/authService'
import {
  getEOSertifikatKegiatan,
  getEOSertifikatPeserta,
  terbitkanSertifikatMassal,
} from '../../services/sertifikatService'
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

  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value

  return new Intl.DateTimeFormat('id-ID', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(date)
}

const formatTime = (value) => {
  if (!value) return '-'
  return String(value).slice(0, 5).replace(':', '.')
}

const getEventName = (event) => event?.namaKegiatan || event?.name || event?.title || '-'
const getEventCategory = (event) => event?.kategori || event?.category || 'Umum'
const getEventStatus = (event) => event?.statusPublikasi || event?.status || 'DRAFT'
const getRegistrantName = (registrant) => registrant.namaMahasiswa || registrant.name || registrant.nama || '-'
const getRegistrantNim = (registrant) => registrant.nim || registrant.nomorInduk || '-'
const getRegistrantKey = (registrant) => registrant.pendaftaranId || registrant.id
const getRegistrantStatus = (registrant) => String(registrant.statusPendaftaran || registrant.status || 'PENDING').toUpperCase()
const isRegistrantApproved = (registrant) => getRegistrantStatus(registrant) === 'DITERIMA'
const getIssuedCount = (event) => Number(event.jumlahSertifikatTerbit ?? event.sertifikatTerbit ?? 0)

const getRegistrationBadge = (status) => {
  if (status === 'DITERIMA') return { label: 'Diterima', className: 'bg-[#EAF7F0] text-[#168148]' }
  if (status === 'DITOLAK') return { label: 'Ditolak', className: 'bg-[#FFECEC] text-[#B42318]' }
  if (status === 'MENUNGGU') return { label: 'Menunggu ACC', className: 'bg-[#FFF4D6] text-[#916400]' }

  return { label: 'Menunggu ACC', className: 'bg-[#FFF4D6] text-[#916400]' }
}

const getStatusMeta = (status) => {
  if (status === 'AKTIF') return { label: 'Aktif', className: 'bg-[#DCE8FF] text-[#0D329D]', dotClassName: 'bg-[#0D5BE1]' }
  if (status === 'SELESAI') return { label: 'Selesai', className: 'bg-[#E6EAEE] text-[#4B5563]', dotClassName: 'bg-[#6B7280]' }
  return { label: 'Draft', className: 'bg-[#E0F0FF] text-[#174EAA]', dotClassName: 'bg-[#52A6FF]' }
}

const getIconTone = (index) => {
  const tones = [
    'bg-[#E8EDFF] text-[#0D329D]',
    'bg-[#EEF6FF] text-[#174EAA]',
    'bg-[#FFF1F1] text-[#C81E1E]',
    'bg-[#EAF7F0] text-[#168148]',
  ]

  return tones[index % tones.length]
}

function StatCard({ label, value, icon: Icon, tone = 'blue' }) {
  const toneClass = {
    blue: 'bg-[#E8EDFF] text-[#0D329D]',
    cyan: 'bg-[#EAF6FF] text-[#075985]',
    green: 'bg-[#EAF7F0] text-[#168148]',
    red: 'bg-[#FFF1F1] text-[#C81E1E]',
  }[tone]

  return (
    <div className="group relative flex min-h-[120px] items-center gap-5 overflow-hidden rounded-2xl border border-[#D8E0F2] bg-white px-6 py-5 shadow-[0_12px_30px_rgba(20,36,82,0.05)] transition duration-300 hover:-translate-y-1 hover:border-[#B9C8F5] hover:shadow-[0_22px_46px_rgba(13,50,157,0.14)]">
      <span className="pointer-events-none absolute -right-10 -top-10 h-28 w-28 rounded-full bg-[#EEF4FF] opacity-0 transition duration-300 group-hover:opacity-100" />
      <div className={`relative flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl transition duration-300 group-hover:scale-105 ${toneClass}`}>
        <Icon className="h-7 w-7" strokeWidth={2.35} />
      </div>
      <div className="relative">
        <p className="text-sm font-extrabold text-[#4B5161]">{label}</p>
        <p className="mt-1 text-[30px] font-black leading-none text-[#171B29] transition duration-300 group-hover:text-[#0D329D]">{value}</p>
      </div>
    </div>
  )
}

function Pagination() {
  return (
    <div className="flex items-center gap-2">
      <button type="button" className="flex h-11 w-11 items-center justify-center rounded-lg border border-[#C7CEDD] bg-white text-[#9AA3B5]">
        <ChevronLeft className="h-5 w-5" strokeWidth={2.4} />
      </button>
      {[1, 2, 3].map((page) => (
        <button
          key={page}
          type="button"
          className={`h-11 w-11 rounded-lg border text-base font-bold ${
            page === 1 ? 'border-[#0D329D] bg-[#0D329D] text-white' : 'border-[#C7CEDD] bg-white text-[#171B29]'
          }`}
        >
          {page}
        </button>
      ))}
      <button type="button" className="flex h-11 w-11 items-center justify-center rounded-lg border border-[#C7CEDD] bg-white text-[#171B29]">
        <ChevronRight className="h-5 w-5" strokeWidth={2.4} />
      </button>
    </div>
  )
}

function CertificateListView({ events, isLoading, errorMessage, onSelectEvent }) {
  const totalParticipants = events.reduce((sum, event) => sum + Number(event.jumlahPendaftar || 0), 0)
  const issuedCertificates = events.reduce((sum, event) => sum + getIssuedCount(event), 0)

  return (
    <>
      <section className="mb-7">
        <div>
          <h2 className="text-[32px] font-black leading-tight text-[#0D329D]">Manajemen Sertifikat</h2>
          <p className="mt-2 max-w-2xl text-base font-semibold leading-relaxed text-[#4E5363]">
            Kelola penerbitan sertifikat peserta dari seluruh kegiatan Anda dalam satu ruang kerja.
          </p>
        </div>
      </section>

      <section className="grid gap-5 md:grid-cols-3">
        <StatCard label="Total Kegiatan" value={events.length} icon={CalendarDays} tone="blue" />
        <StatCard label="Total Peserta" value={totalParticipants.toLocaleString('id-ID')} icon={UsersRound} tone="cyan" />
        <StatCard label="Sertifikat Terbit" value={issuedCertificates.toLocaleString('id-ID')} icon={ShieldCheck} tone="green" />
      </section>

      <section className="mt-8 overflow-hidden rounded-2xl border border-[#D8E0F2] bg-white shadow-[0_14px_36px_rgba(20,36,82,0.06)]">
        <div className="flex flex-col gap-4 border-b border-[#E2E7F2] px-6 py-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-3">
            <ListChecks className="h-6 w-6 text-[#0D329D]" strokeWidth={2.5} />
            <h3 className="text-[24px] font-black text-[#0D329D]">Daftar Kegiatan Terbaru</h3>
          </div>
          <div className="flex gap-3">
            <button type="button" className="inline-flex h-11 items-center gap-2 rounded-lg border border-[#9BA3B4] bg-white px-4 text-sm font-extrabold text-[#282D39]">
              <Filter className="h-4 w-4" strokeWidth={2.4} />
              Filter
            </button>
            <button type="button" className="inline-flex h-11 items-center gap-2 rounded-lg border border-[#9BA3B4] bg-white px-4 text-sm font-extrabold text-[#282D39]">
              <Download className="h-4 w-4" strokeWidth={2.4} />
              Export
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[920px] border-collapse">
            <thead>
              <tr className="bg-[#0D329D] text-left text-sm font-black uppercase tracking-wide text-white">
                <th className="px-7 py-5">Detail Kegiatan</th>
                <th className="px-7 py-5">Waktu & Lokasi</th>
                <th className="px-7 py-5">Status</th>
                <th className="px-7 py-5">Peserta</th>
                <th className="px-7 py-5 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#DCE2EE]">
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="px-7 py-12 text-center text-sm font-semibold text-[#747B8E]">Memuat kegiatan...</td>
                </tr>
              ) : null}

              {!isLoading && errorMessage ? (
                <tr>
                  <td colSpan={5} className="px-7 py-12 text-center text-sm font-semibold text-red-600">{errorMessage}</td>
                </tr>
              ) : null}

              {!isLoading && !errorMessage && events.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-7 py-12 text-center text-sm font-semibold text-[#747B8E]">Belum ada kegiatan yang tersedia.</td>
                </tr>
              ) : null}

              {!isLoading && !errorMessage ? events.map((event, index) => {
                const statusMeta = getStatusMeta(getEventStatus(event))
                const participants = Number(event.jumlahPendaftar || 0)
                const issued = getIssuedCount(event)

                return (
                  <tr key={event.id} className="transition hover:bg-[#F8FAFF]">
                    <td className="px-7 py-6">
                      <div className="flex items-center gap-4">
                        <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-lg ${getIconTone(index)}`}>
                          <Award className="h-6 w-6" strokeWidth={2.35} />
                        </div>
                        <div>
                          <p className="max-w-[280px] text-base font-black leading-snug text-[#0D329D]">{getEventName(event)}</p>
                          <p className="mt-1 text-sm font-extrabold text-[#4E5363]">Kategori: {getEventCategory(event)}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-7 py-6 text-sm font-bold text-[#4E5363]">
                      <div className="flex items-center gap-2">
                        <CalendarDays className="h-4 w-4" strokeWidth={2.2} />
                        <span>{formatDate(event.tanggal)}, {formatTime(event.waktu)}</span>
                      </div>
                      <div className="mt-1.5 flex items-center gap-2">
                        <MapPin className="h-4 w-4" strokeWidth={2.2} />
                        <span>{event.lokasi || '-'}</span>
                      </div>
                    </td>
                    <td className="px-7 py-6">
                      <span className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-sm font-bold ${statusMeta.className}`}>
                        <span className={`h-2 w-2 rounded-full ${statusMeta.dotClassName}`} />
                        {statusMeta.label}
                      </span>
                    </td>
                    <td className="px-7 py-6">
                      <p className="text-base font-black text-[#171B29]">{participants}</p>
                      <p className="text-sm font-semibold text-[#4E5363]">{issued} sertifikat</p>
                    </td>
                    <td className="px-7 py-6">
                      <div className="flex items-center justify-end">
                        <button
                          type="button"
                          onClick={() => onSelectEvent(event)}
                          className="inline-flex h-12 min-w-[124px] items-center justify-center rounded-lg bg-[#0D329D] px-4 text-sm font-black text-white transition hover:bg-[#09277D]"
                        >
                          Kelola Sertifikat
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              }) : null}
            </tbody>
          </table>
        </div>

        <div className="flex flex-col gap-4 border-t border-[#DCE2EE] px-7 py-6 lg:flex-row lg:items-center lg:justify-between">
          <p className="text-base font-semibold text-[#4E5363]">Menampilkan 1-{Math.min(events.length, 5)} dari {events.length} kegiatan</p>
          <Pagination />
        </div>
      </section>
    </>
  )
}

function CertificateIssueView({
  event,
  registrants,
  searchQuery,
  setSearchQuery,
  folderUrl,
  setFolderUrl,
  eligibility,
  setEligibility,
  publishResult,
  isPublishing,
  errorMessage,
  onBack,
  onPublish,
}) {
  const filteredRegistrants = useMemo(() => {
    const query = searchQuery.trim().toLowerCase()
    if (!query) return registrants

    return registrants.filter((registrant) =>
      [getRegistrantName(registrant), getRegistrantNim(registrant), registrant.email]
        .some((field) => String(field || '').toLowerCase().includes(query)),
    )
  }, [registrants, searchQuery])

  const eligibleCount = registrants.filter((registrant) => {
    const key = getRegistrantKey(registrant)
    return eligibility[key] && registrant.mahasiswaId && isRegistrantApproved(registrant) && !registrant.sertifikatTerbit
  }).length

  return (
    <>
      <section className="mb-6 flex items-center justify-between gap-4">
        <div className="flex min-w-0 items-center gap-3">
          <button type="button" onClick={onBack} className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-[#0D329D] transition hover:bg-[#EAF1FF]" aria-label="Kembali">
            <ChevronLeft className="h-6 w-6" strokeWidth={2.6} />
          </button>
          <div className="min-w-0">
            <h2 className="truncate text-[30px] font-black leading-tight text-[#0D329D]">Penerbitan Sertifikat Massal</h2>
            <p className="mt-1 text-sm font-semibold text-[#4E5363]">Validasi kelayakan peserta dan tautkan folder sertifikat untuk kegiatan terpilih.</p>
          </div>
        </div>
      </section>

      <section className="mb-6 rounded-2xl border border-[#CFE0FF] bg-[#F4F8FF] px-5 py-4 shadow-[0_10px_28px_rgba(13,50,157,0.06)]">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
          <div className="max-w-[360px]">
            <p className="text-sm font-black text-[#0D329D]">Panduan singkat penerbitan</p>
            <p className="mt-1 text-xs font-semibold leading-relaxed text-[#536078]">
              Sertifikat hanya bisa diterbitkan untuk mahasiswa yang pendaftarannya sudah diterima.
            </p>
          </div>
          <div className="grid flex-1 gap-3 md:grid-cols-3">
            <GuideStep icon={CheckCircle2} step="1" title="ACC peserta" description="Pastikan status pendaftaran sudah Diterima." />
            <GuideStep icon={ToggleRight} step="2" title="Pilih kelayakan" description="Aktifkan peserta yang berhak menerima sertifikat." />
            <GuideStep icon={Link} step="3" title="Kirim tautan" description="Set Drive ke Anyone with the link, lalu terbitkan." />
          </div>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[360px_1fr]">
        <div className="rounded-2xl border border-[#D8E0F2] bg-white p-6 shadow-[0_12px_30px_rgba(20,36,82,0.05)]">
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-[#E8EDFF] text-[#0D329D]">
              <FileText className="h-6 w-6" strokeWidth={2.4} />
            </div>
            <h3 className="text-lg font-black text-[#171B29]">Informasi Kegiatan</h3>
          </div>
          <InfoBlock label="Nama Kegiatan" value={getEventName(event)} />
          <div className="mt-6 grid grid-cols-2 gap-5">
            <InfoBlock label="Tanggal Pelaksanaan" value={formatDate(event.tanggal)} />
            <InfoBlock label="Total Peserta" value={String(event.jumlahPendaftar || registrants.length)} accent />
          </div>
          <div className="mt-6 rounded-xl bg-[#F6F8FE] px-4 py-3">
            <p className="text-xs font-extrabold uppercase text-[#7A8191]">Kelayakan</p>
            <p className="mt-1 text-lg font-black text-[#0D329D]">{eligibleCount} peserta terpilih</p>
          </div>
        </div>

        <div className="rounded-2xl border border-[#D8E0F2] bg-white p-6 shadow-[0_12px_30px_rgba(20,36,82,0.05)]">
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-[#E8EDFF] text-[#0D329D]">
              <Cloud className="h-6 w-6" strokeWidth={2.4} />
            </div>
            <h3 className="text-lg font-black text-[#171B29]">Tautan Folder Sertifikat Massal</h3>
          </div>
          <p className="max-w-2xl text-sm font-semibold leading-relaxed text-[#5E6677]">
            Masukkan tautan Google Drive folder sertifikat. Sertifikat dapat dipetakan otomatis berdasarkan NIM mahasiswa yang tertulis pada nama berkas.
          </p>
          <div className="mt-4 rounded-xl border border-[#DCE7FF] bg-[#F7FAFF] px-4 py-3 text-sm font-semibold leading-relaxed text-[#536078]">
            Atur akses Drive ke <span className="font-black text-[#0D329D]">Anyone with the link</span> minimal sebagai <span className="font-black text-[#0D329D]">Viewer</span>, agar mahasiswa bisa membuka sertifikat. Gunakan akses Editor hanya untuk tim internal yang perlu mengubah berkas.
          </div>
          <div className="mt-6 flex flex-col gap-3 lg:flex-row">
            <input
              value={folderUrl}
              onChange={(eventChange) => setFolderUrl(eventChange.target.value)}
              placeholder="https://drive.google.com/drive/folders/..."
              className="h-14 min-w-0 flex-1 rounded-lg border border-[#D5DBEA] bg-white px-4 text-sm font-semibold text-[#171B29] outline-none transition placeholder:text-[#8A93A5] focus:border-[#0D329D] focus:ring-4 focus:ring-[#E0E8FF]"
            />
            <button
              type="button"
              onClick={onPublish}
              disabled={isPublishing}
              className="inline-flex h-14 items-center justify-center gap-2 rounded-lg bg-[#0D5BE1] px-7 text-sm font-black text-white shadow-[0_14px_28px_rgba(13,91,225,0.22)] transition hover:-translate-y-0.5 hover:bg-[#0B49B8] hover:shadow-[0_18px_36px_rgba(13,91,225,0.28)] disabled:cursor-not-allowed disabled:opacity-70"
            >
              <Send className="h-5 w-5" strokeWidth={2.4} />
              {isPublishing ? 'Menerbitkan...' : 'Terbitkan Sertifikat'}
            </button>
          </div>
          {publishResult ? (
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              <div className="rounded-xl border border-[#BFE8CF] bg-[#F0FFF5] px-4 py-3">
                <p className="text-xs font-extrabold uppercase text-[#168148]">Terbit</p>
                <p className="mt-1 text-2xl font-black text-[#168148]">{publishResult.jumlahTerbit ?? 0}</p>
              </div>
              <div className="rounded-xl border border-[#D8E0F2] bg-[#F8FAFF] px-4 py-3">
                <p className="text-xs font-extrabold uppercase text-[#6B7280]">Dilewati</p>
                <p className="mt-1 text-2xl font-black text-[#4B5563]">{publishResult.jumlahDilewati ?? 0}</p>
              </div>
            </div>
          ) : null}
        </div>
      </section>

      {errorMessage ? (
        <div className="mt-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-bold text-red-600">
          {errorMessage}
        </div>
      ) : null}

      <section className="mt-7 overflow-hidden rounded-2xl border border-[#D8E0F2] bg-white shadow-[0_14px_36px_rgba(20,36,82,0.06)]">
        <div className="flex flex-col gap-4 border-b border-[#E2E7F2] px-6 py-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-3">
            <UsersRound className="h-6 w-6 text-[#0D329D]" strokeWidth={2.5} />
            <h3 className="text-xl font-black text-[#171B29]">Daftar Peserta & Kelayakan</h3>
          </div>
          <div className="flex h-11 w-full items-center rounded-xl border border-[#CDD5E8] bg-[#F8FAFF] px-3 lg:w-[320px]">
            <Search className="h-5 w-5 text-[#7A8191]" strokeWidth={2.2} />
            <input
              value={searchQuery}
              onChange={(eventChange) => setSearchQuery(eventChange.target.value)}
              placeholder="Cari nama atau NIM..."
              className="h-full min-w-0 flex-1 bg-transparent px-3 text-sm font-semibold text-[#171B29] outline-none placeholder:text-[#8A93A5]"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] border-collapse">
            <thead>
              <tr className="bg-[#F2F5FA] text-left text-sm font-black text-[#4B5161]">
                <th className="px-7 py-4">Nama & NIM</th>
                <th className="px-7 py-4">Kelayakan Sertifikat</th>
                <th className="px-7 py-4">Keterangan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#DCE2EE]">
              {filteredRegistrants.length === 0 ? (
                <tr>
                  <td colSpan={3} className="px-7 py-12 text-center text-sm font-semibold text-[#747B8E]">Belum ada peserta yang cocok.</td>
                </tr>
              ) : null}
              {filteredRegistrants.map((registrant) => {
                const registrantKey = getRegistrantKey(registrant)
                const isEligible = Boolean(eligibility[registrantKey])
                const isPublished = Boolean(registrant.sertifikatTerbit)
                const hasLinkedStudent = Boolean(registrant.mahasiswaId)
                const registrationStatus = getRegistrantStatus(registrant)
                const registrationBadge = getRegistrationBadge(registrationStatus)
                const isApproved = isRegistrantApproved(registrant)
                const isDisabled = isPublished || !hasLinkedStudent || !isApproved

                return (
                  <tr key={registrantKey} className={`transition hover:bg-[#FAFBFF] ${isDisabled && !isPublished ? 'bg-[#FFFCF5]' : ''}`}>
                    <td className="px-7 py-5">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="font-black text-[#171B29]">{getRegistrantName(registrant)}</p>
                        {!isApproved && !isPublished ? (
                          <span className={`rounded-full px-2.5 py-1 text-[11px] font-black ${registrationBadge.className}`}>
                            {registrationBadge.label}
                          </span>
                        ) : null}
                      </div>
                      <p className="mt-1 text-sm font-semibold text-[#6B7280]">{getRegistrantNim(registrant)}</p>
                      {!hasLinkedStudent ? (
                        <p className="mt-2 text-xs font-bold text-[#C2410C]">Akun mahasiswa tidak ditemukan</p>
                      ) : null}
                    </td>
                    <td className="px-7 py-5">
                      {isDisabled ? (
                        <div className="inline-flex items-center gap-2 rounded-xl border border-[#E4E8F1] bg-[#F3F5F9] px-3 py-2 text-sm font-black text-[#7A8191]">
                          <LockKeyhole className="h-4 w-4" strokeWidth={2.5} />
                          Terkunci
                        </div>
                      ) : (
                        <>
                          <button
                            type="button"
                            onClick={() => setEligibility((current) => ({ ...current, [registrantKey]: !isEligible }))}
                            className={`inline-flex h-8 w-14 items-center rounded-full p-1 transition ${
                              isEligible ? 'bg-[#0D5BE1]' : 'bg-[#DDE2EA]'
                            }`}
                            aria-label="Ubah kelayakan sertifikat"
                          >
                            <span className={`h-6 w-6 rounded-full bg-white shadow transition ${isEligible ? 'translate-x-6' : 'translate-x-0'}`} />
                          </button>
                          <span className="ml-3 text-sm font-bold text-[#4B5161]">Berhak Menerima</span>
                        </>
                      )}
                    </td>
                    <td className="px-7 py-5 text-sm font-semibold text-[#8A93A5]">
                      {isPublished ? (
                        <span className="inline-flex rounded-full bg-[#EAF7F0] px-3 py-1 text-xs font-black text-[#168148]">Sudah Terbit</span>
                      ) : !hasLinkedStudent ? (
                        <div>
                          <span className="inline-flex rounded-full bg-[#FFF4D6] px-3 py-1 text-xs font-black text-[#916400]">Akun belum terhubung</span>
                          <p className="mt-2 text-xs font-semibold text-[#8A6D1D]">Pastikan pendaftaran terhubung ke akun mahasiswa.</p>
                        </div>
                      ) : !isApproved ? (
                        <div>
                          <span className={`inline-flex rounded-full px-3 py-1 text-xs font-black ${registrationBadge.className}`}>
                            {registrationBadge.label}
                          </span>
                          <p className="mt-2 text-xs font-semibold text-[#8A6D1D]">Approve pendaftaran mahasiswa dulu di menu Kelola Pendaftaran.</p>
                        </div>
                      ) : (
                        <span className="italic">{isEligible && hasLinkedStudent && isApproved ? 'Siap diterbitkan' : 'Tidak dipilih untuk penerbitan'}</span>
                      )}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        <div className="flex justify-center border-t border-[#DCE2EE] px-7 py-5">
          <Pagination />
        </div>
      </section>

      <section className="mt-7 border-t border-[#D8E0F2] pt-6">
        <p className="inline-flex items-center gap-3 text-sm font-bold text-[#5E6677]">
          <CheckCircle2 className="h-5 w-5 text-[#0D329D]" strokeWidth={2.4} />
          {eligibleCount} dari {registrants.length} peserta terpilih untuk menerima sertifikat.
        </p>
      </section>
    </>
  )
}

function InfoBlock({ label, value, accent = false }) {
  return (
    <div>
      <p className="text-sm font-bold text-[#6B7280]">{label}</p>
      <p className={`mt-1 text-base font-black leading-snug ${accent ? 'text-[#0D5BE1]' : 'text-[#171B29]'}`}>{value}</p>
    </div>
  )
}

function GuideStep({ icon: Icon, step, title, description }) {
  return (
    <div className="group flex gap-3 rounded-xl border border-[#DCE7FF] bg-white px-4 py-3 transition duration-300 hover:-translate-y-0.5 hover:border-[#B9C8F5] hover:shadow-[0_14px_28px_rgba(13,50,157,0.10)]">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#E8EDFF] text-[#0D329D] transition duration-300 group-hover:scale-105 group-hover:bg-[#DDE8FF]">
        <Icon className="h-5 w-5" strokeWidth={2.5} />
      </div>
      <div className="min-w-0">
        <p className="text-xs font-black uppercase text-[#0D329D]">Langkah {step}</p>
        <p className="mt-0.5 text-sm font-black text-[#171B29] transition group-hover:text-[#0D329D]">{title}</p>
        <p className="mt-1 text-xs font-semibold leading-relaxed text-[#687085]">{description}</p>
      </div>
    </div>
  )
}

function SertifikatEOPage() {
  const navigate = useNavigate()
  const [organizerName, setOrganizerName] = useState(getStoredUser()?.name || 'Event Organizer')
  const [events, setEvents] = useState([])
  const [selectedEventId, setSelectedEventId] = useState(null)
  const [registrants, setRegistrants] = useState([])
  const [eligibility, setEligibility] = useState({})
  const [folderUrl, setFolderUrl] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [isLoadingRegistrants, setIsLoadingRegistrants] = useState(false)
  const [isPublishing, setIsPublishing] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [toastMessage, setToastMessage] = useState('')
  const [publishResult, setPublishResult] = useState(null)

  const handleRequestError = useCallback((error, fallbackMessage) => {
    if (error.status === 401) {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      navigate('/login', { replace: true })
      return
    }

    setErrorMessage(error.message || fallbackMessage)
  }, [navigate])

  const loadEvents = useCallback(async () => {
    try {
      setIsLoading(true)
      setErrorMessage('')
      const data = await getEOSertifikatKegiatan()
      setEvents(data)
    } catch (error) {
      handleRequestError(error, 'Gagal memuat data sertifikat.')
    } finally {
      setIsLoading(false)
    }
  }, [handleRequestError])

  const loadRegistrants = useCallback(async (kegiatanId) => {
    try {
      setIsLoadingRegistrants(true)
      setSearchQuery('')
      setErrorMessage('')
      const data = await getEOSertifikatPeserta(kegiatanId)
      setRegistrants(data)
      setEligibility(
        data.reduce((result, registrant) => {
          const key = getRegistrantKey(registrant)
          if (!key) return result

          return {
            ...result,
            [key]: Boolean((registrant.layakSertifikat && isRegistrantApproved(registrant)) || registrant.sertifikatTerbit),
          }
        }, {}),
      )
    } catch (error) {
      setRegistrants([])
      setEligibility({})
      handleRequestError(error, 'Gagal memuat daftar peserta.')
    } finally {
      setIsLoadingRegistrants(false)
    }
  }, [handleRequestError])

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
        return loadEvents()
      })
      .catch((error) => {
        handleRequestError(error, 'Gagal memuat data sertifikat.')
      })
  }, [handleRequestError, loadEvents, navigate])

  useEffect(() => {
    if (!selectedEventId) return
    loadRegistrants(selectedEventId)
  }, [loadRegistrants, selectedEventId])

  useEffect(() => {
    if (!toastMessage) return undefined

    const timeoutId = window.setTimeout(() => setToastMessage(''), 3500)
    return () => window.clearTimeout(timeoutId)
  }, [toastMessage])

  const selectedEvent = events.find((event) => event.id === selectedEventId) || null

  const handleSelectEvent = (event) => {
    setSelectedEventId(event.id)
    setFolderUrl('')
    setPublishResult(null)
  }

  const handleBackToList = () => {
    setSelectedEventId(null)
    setRegistrants([])
    setEligibility({})
    setFolderUrl('')
    setSearchQuery('')
    setPublishResult(null)
    setErrorMessage('')
  }

  const handlePublish = async () => {
    try {
      setIsPublishing(true)
      setErrorMessage('')
      setPublishResult(null)

      const payload = {
        driveLink: folderUrl.trim(),
        peserta: registrants
          .filter((registrant) => {
            const key = getRegistrantKey(registrant)

            return (
              Boolean(eligibility[key]) &&
              Boolean(registrant.mahasiswaId) &&
              isRegistrantApproved(registrant) &&
              !registrant.sertifikatTerbit
            )
          })
          .map((registrant) => ({
            pendaftaranId: registrant.pendaftaranId,
            mahasiswaId: registrant.mahasiswaId,
            layak: true,
          })),
      }

      const result = await terbitkanSertifikatMassal(selectedEventId, payload)
      setPublishResult(result)
      setToastMessage(result?.message || 'Sertifikat berhasil diterbitkan.')
      await Promise.all([loadEvents(), loadRegistrants(selectedEventId)])
    } catch (error) {
      handleRequestError(error, 'Gagal menerbitkan sertifikat.')
    } finally {
      setIsPublishing(false)
    }
  }

  return (
    <EOLayout title="Sertifikat" organizerName={organizerName}>
      <Toast message={toastMessage} onClose={() => setToastMessage('')} />

      {selectedEvent ? (
        isLoadingRegistrants ? (
          <div className="rounded-2xl border border-[#D8E0F2] bg-white p-10 text-center text-sm font-semibold text-[#747B8E]">
            Memuat peserta kegiatan...
          </div>
        ) : (
          <CertificateIssueView
            event={selectedEvent}
            registrants={registrants}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            folderUrl={folderUrl}
            setFolderUrl={setFolderUrl}
            eligibility={eligibility}
            setEligibility={setEligibility}
            publishResult={publishResult}
            isPublishing={isPublishing}
            errorMessage={errorMessage}
            onBack={handleBackToList}
            onPublish={handlePublish}
          />
        )
      ) : (
        <CertificateListView
          events={events}
          isLoading={isLoading}
          errorMessage={errorMessage}
          onSelectEvent={handleSelectEvent}
        />
      )}
    </EOLayout>
  )
}

export default SertifikatEOPage
