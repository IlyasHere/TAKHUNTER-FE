import { ArrowLeft, CalendarDays, CheckCircle2, CloudUpload, FileText, Info, LockKeyhole, Save, Ticket, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import Button from '../../components/ui/Button'
import { checkAuth } from '../../services/authService'
import { getKegiatanDetail, updateKegiatan } from '../../services/kegiatanService'
import EOLayout from './components/EOLayout'
import { getBannerUrl, getRegistrantCount, toTimeInput } from './detailUtils'

const getStoredUser = () => {
  try {
    return JSON.parse(localStorage.getItem('user')) || null
  } catch {
    return null
  }
}

const MAX_BANNER_SIZE_MB = 2
const MAX_BANNER_SIZE_BYTES = MAX_BANNER_SIZE_MB * 1024 * 1024
const EO_TOAST_STORAGE_KEY = 'eoToastMessage'

const isValidOptionalQuota = (value) => {
  if (value === '') return true

  const quota = Number(value)
  return Number.isInteger(quota) && quota >= 1
}

function Field({ label, required = false, children, className = '', hint = '' }) {
  return (
    <label className={`block ${className}`}>
      <span className="text-sm font-extrabold text-[#1D2230]">
        {label} {required ? <span className="text-[#DC1717]">*</span> : null}
      </span>
      <div className="mt-2">{children}</div>
      {hint ? <p className="mt-2 text-xs font-semibold text-[#747B8E]">{hint}</p> : null}
    </label>
  )
}

function fieldClass(extra = '', locked = false) {
  return `h-[58px] w-full rounded-2xl border border-[#B9C0D3] px-5 text-[16px] font-semibold text-[#202433] outline-none transition placeholder:text-[#747B8E] focus:border-[#0D329D] focus:ring-4 focus:ring-[#DDE5FF] ${locked ? 'cursor-not-allowed bg-[#ECEFF7] text-[#747B8E]' : 'bg-[#F8F8FF] focus:bg-white'} ${extra}`
}

function EditKegiatanPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [organizerName, setOrganizerName] = useState(getStoredUser()?.name || 'Event Organizer')
  const [isMandatory, setIsMandatory] = useState(false)
  const [bannerFile, setBannerFile] = useState(null)
  const [currentBannerUrl, setCurrentBannerUrl] = useState('')
  const [registrantCount, setRegistrantCount] = useState(0)
  const [form, setForm] = useState({
    namaKegiatan: '',
    deskripsi: '',
    kategori: '',
    poinTak: '',
    tanggal: '',
    waktu: '',
    lokasi: '',
    kuotaPeserta: '',
    batasPendaftaran: '',
    statusPublikasi: 'DRAFT',
  })
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [debugError, setDebugError] = useState(null)

  const isLockedByRegistrants = registrantCount > 0

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
      .then((event) => {
        if (!event) return

        setForm({
          namaKegiatan: event.namaKegiatan || '',
          deskripsi: event.deskripsi || '',
          kategori: event.kategori || '',
          poinTak: String(event.poinTak ?? ''),
          tanggal: event.tanggal || '',
          waktu: toTimeInput(event.waktu),
          lokasi: event.lokasi || '',
          kuotaPeserta: String(event.kuotaPeserta ?? ''),
          batasPendaftaran: event.batasPendaftaran || '',
          statusPublikasi: event.statusPublikasi || 'DRAFT',
        })
        setIsMandatory(Boolean(event.wajib))
        setCurrentBannerUrl(getBannerUrl(event))
        setRegistrantCount(getRegistrantCount(event))
      })
      .catch((error) => setErrorMessage(error.message || 'Gagal memuat data kegiatan.'))
      .finally(() => setIsLoading(false))
  }, [id, navigate])

  const handleChange = (event) => {
    const { name, value } = event.target
    setForm((currentForm) => ({ ...currentForm, [name]: value }))
  }

  const handleBannerChange = (event) => {
    const file = event.target.files?.[0]

    if (file && file.size > MAX_BANNER_SIZE_BYTES) {
      event.target.value = ''
      setBannerFile(null)
      setErrorMessage(`Ukuran banner maksimal ${MAX_BANNER_SIZE_MB}MB. Pilih gambar yang lebih kecil.`)
      setDebugError(null)
      return
    }

    setErrorMessage('')
    setDebugError(null)
    setBannerFile(file || null)
  }

  const buildPayload = (statusPublikasi = form.statusPublikasi) => {
    const formData = new FormData()

    formData.append('namaKegiatan', form.namaKegiatan)
    formData.append('deskripsi', form.deskripsi)
    formData.append('kategori', form.kategori)
    formData.append('poinTak', String(Number(form.poinTak || 0)))
    formData.append('wajib', String(isMandatory))
    formData.append('tanggal', form.tanggal)
    formData.append('waktu', form.waktu ? `${form.waktu}:00` : '')
    formData.append('lokasi', form.lokasi)
    if (form.kuotaPeserta !== '') {
      formData.append('kuotaPeserta', String(Number(form.kuotaPeserta)))
    }
    formData.append('batasPendaftaran', form.batasPendaftaran)
    formData.append('statusPublikasi', statusPublikasi)

    if (bannerFile) {
      formData.append('banner', bannerFile)
    }

    return formData
  }

  const submitKegiatan = async (statusPublikasi) => {
    setIsSubmitting(true)
    setErrorMessage('')
    setDebugError(null)

    if (!isValidOptionalQuota(form.kuotaPeserta)) {
      setIsSubmitting(false)
      setErrorMessage('Kuota peserta harus berupa angka bulat minimal 1 jika diisi.')
      return
    }

    try {
      await updateKegiatan(id, buildPayload(statusPublikasi))
      sessionStorage.setItem(EO_TOAST_STORAGE_KEY, 'Kegiatan berhasil diperbarui.')
      navigate('/event-organizer/dashboard')
    } catch (error) {
      setErrorMessage(error.message || 'Gagal memperbarui kegiatan.')
      setDebugError({
        method: error.method,
        url: error.url,
        status: error.status,
        statusText: error.statusText,
        responseBody: error.responseBody,
        hasToken: error.hasToken,
        tokenPreview: error.tokenPreview,
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    submitKegiatan(form.statusPublikasi)
  }

  return (
    <EOLayout title="Edit Kegiatan" organizerName={organizerName}>
      <form onSubmit={handleSubmit} className="mx-auto max-w-[1120px]">
        <section className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <button
              type="button"
              onClick={() => navigate('/event-organizer/dashboard')}
              className="mb-5 inline-flex h-10 items-center gap-2 rounded-xl border border-[#CED3E5] bg-white px-4 text-sm font-extrabold text-[#0D329D] shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
            >
              <ArrowLeft className="h-4 w-4" strokeWidth={2.3} />
              Kembali
            </button>
            <h2 className="text-[32px] font-extrabold leading-tight text-[#0D329D]">Edit Kegiatan</h2>
            <p className="mt-2 max-w-[780px] text-[18px] leading-relaxed text-[#555B68]">
              Perbarui informasi kegiatan. Poin TAK dan status wajib dikunci jika kegiatan sudah memiliki pendaftar.
            </p>
          </div>
        </section>

        {isLockedByRegistrants ? (
          <div className="mb-6 flex items-start gap-3 rounded-2xl border border-[#DDE5FF] bg-[#EEF3FF] px-5 py-4 text-[#0D329D]">
            <LockKeyhole className="mt-0.5 h-5 w-5" />
            <p className="text-sm font-bold leading-relaxed">
              Kegiatan ini sudah memiliki {registrantCount} pendaftar. Field Poin TAK dan Status Wajib tidak bisa diedit agar aturan peserta tetap konsisten.
            </p>
          </div>
        ) : null}

        {errorMessage ? (
          <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-600">
            <p>{errorMessage}</p>
            {debugError ? (
              <pre className="mt-3 max-h-56 overflow-auto rounded-lg bg-white/80 p-3 text-xs font-semibold text-red-700">
{JSON.stringify(debugError, null, 2)}
              </pre>
            ) : null}
          </div>
        ) : null}
        {isLoading ? <p className="rounded-2xl bg-white p-8 text-center font-semibold text-[#747B8E]">Memuat data kegiatan...</p> : null}

        {!isLoading ? (
          <>
            <section className="rounded-[24px] border border-[#E0E5F2] bg-white p-7 shadow-[0_18px_45px_rgba(28,42,91,0.06)] lg:p-8">
              <div className="mb-6 flex items-center gap-4 border-b border-[#E6EAF4] pb-5">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#EEF3FF] text-[#4758E0]">
                  <Info className="h-5 w-5" strokeWidth={2.4} />
                </div>
                <h3 className="text-[26px] font-extrabold text-[#161A27]">Info Umum</h3>
              </div>

              <div className="grid gap-6">
                <Field label="Nama Kegiatan" required>
                  <input className={fieldClass()} name="namaKegiatan" value={form.namaKegiatan} onChange={handleChange} required />
                </Field>

                <Field label="Deskripsi" required>
                  <textarea className={fieldClass('min-h-[120px] resize-none py-4')} name="deskripsi" value={form.deskripsi} onChange={handleChange} required />
                </Field>

                <div className="grid gap-6 lg:grid-cols-2">
                  <Field label="Kategori" required>
                    <select className={fieldClass()} name="kategori" value={form.kategori} onChange={handleChange} required>
                      <option value="" disabled>Pilih Kategori</option>
                      <option>Seminar</option>
                      <option>Workshop</option>
                      <option>Lomba</option>
                      <option>Pelatihan</option>
                    </select>
                  </Field>

                  <Field label="Poin TAK" required hint={isLockedByRegistrants ? 'Tidak bisa diedit karena kegiatan sudah memiliki pendaftar.' : ''}>
                    <div className="relative">
                      <Ticket className="pointer-events-none absolute left-5 top-1/2 h-5 w-5 -translate-y-1/2 text-[#4758E0]" strokeWidth={2.2} />
                      <input className={fieldClass('pl-12', isLockedByRegistrants)} name="poinTak" value={form.poinTak} onChange={handleChange} type="number" min="0" disabled={isLockedByRegistrants} required />
                    </div>
                  </Field>
                </div>

                <Field label="Status Wajib" required hint={isLockedByRegistrants ? 'Tidak bisa diedit karena kegiatan sudah memiliki pendaftar.' : ''}>
                  <button
                    type="button"
                    disabled={isLockedByRegistrants}
                    onClick={() => setIsMandatory((value) => !value)}
                    className={`flex items-center gap-4 text-[16px] font-semibold text-[#202433] ${isLockedByRegistrants ? 'cursor-not-allowed opacity-60' : ''}`}
                  >
                    <span className={`flex h-[30px] w-[56px] items-center rounded-full p-1 transition ${isMandatory ? 'bg-[#4758E0]' : 'bg-[#DDE2F0]'}`}>
                      <span className={`h-6 w-6 rounded-full bg-white shadow transition ${isMandatory ? 'translate-x-[26px]' : 'translate-x-0'}`} />
                    </span>
                    Wajib
                  </button>
                </Field>

                <Field label="Unggah Banner Baru">
                  <label className="flex min-h-[190px] cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-[#C7CCE0] bg-[#F1F4FF] px-6 text-center transition hover:border-[#4758E0] hover:bg-[#EEF3FF]">
                    {currentBannerUrl && !bannerFile ? <img src={currentBannerUrl} alt="Banner saat ini" className="mb-5 h-28 w-full max-w-md rounded-xl object-cover" /> : <CloudUpload className="h-12 w-12 text-[#3349D8]" strokeWidth={2.5} />}
                    <span className="text-[20px] font-semibold text-[#555B68]">
                      {bannerFile ? bannerFile.name : 'Klik untuk mengganti banner'}
                    </span>
                    <span className="mt-2 text-[18px] font-semibold text-[#747B8E]">Kosongkan jika tidak ingin mengganti banner. Maks. {MAX_BANNER_SIZE_MB}MB.</span>
                    <input type="file" name="banner" accept="image/png,image/jpeg,image/jpg" className="sr-only" onChange={handleBannerChange} />
                  </label>
                </Field>
              </div>
            </section>

            <section className="mt-7 rounded-[24px] border border-[#E0E5F2] bg-white p-7 shadow-[0_18px_45px_rgba(28,42,91,0.06)] lg:p-8">
              <div className="mb-6 flex items-center gap-4 border-b border-[#E6EAF4] pb-5">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#EEF3FF] text-[#4758E0]">
                  <CalendarDays className="h-5 w-5" strokeWidth={2.4} />
                </div>
                <h3 className="text-[26px] font-extrabold text-[#161A27]">Waktu & Lokasi</h3>
              </div>

              <div className="grid gap-6 lg:grid-cols-2">
                <Field label="Tanggal" required>
                  <input className={fieldClass()} name="tanggal" value={form.tanggal} onChange={handleChange} type="date" required />
                </Field>
                <Field label="Waktu" required>
                  <input className={fieldClass()} name="waktu" value={form.waktu} onChange={handleChange} type="time" required />
                </Field>
                <Field label="Lokasi" required className="lg:col-span-2">
                  <input className={fieldClass()} name="lokasi" value={form.lokasi} onChange={handleChange} required />
                </Field>
              </div>
            </section>

            <section className="mt-7 rounded-[24px] border border-[#E0E5F2] bg-white p-7 shadow-[0_18px_45px_rgba(28,42,91,0.06)] lg:p-8">
              <div className="mb-6 flex items-center gap-4 border-b border-[#E6EAF4] pb-5">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#EEF3FF] text-[#4758E0]">
                  <FileText className="h-5 w-5" strokeWidth={2.4} />
                </div>
                <h3 className="text-[26px] font-extrabold text-[#161A27]">Publikasi & Kuota</h3>
              </div>

              <div className="grid gap-6 lg:grid-cols-3">
                <Field label="Kuota Peserta">
                  <input className={fieldClass()} name="kuotaPeserta" value={form.kuotaPeserta} onChange={handleChange} type="number" min="1" step="1" placeholder="Opsional" />
                </Field>
                <Field label="Batas Pendaftaran" required>
                  <input className={fieldClass()} name="batasPendaftaran" value={form.batasPendaftaran} onChange={handleChange} type="date" required />
                </Field>
                <Field label="Status Publikasi" required>
                  <select className={fieldClass()} name="statusPublikasi" value={form.statusPublikasi} onChange={handleChange} required>
                    <option value="DRAFT">Draft</option>
                    <option value="AKTIF">Aktif</option>
                  </select>
                </Field>
              </div>
            </section>

            <div className="sticky bottom-0 mt-7 flex flex-col gap-3 rounded-2xl border border-[#E0E5F2] bg-white/90 p-4 shadow-[0_-12px_38px_rgba(28,42,91,0.08)] backdrop-blur md:flex-row md:justify-end">
              <button
                type="button"
                onClick={() => navigate('/event-organizer/dashboard')}
                className="inline-flex h-12 items-center justify-center gap-2 rounded-xl border border-[#CED3E5] bg-white px-6 text-sm font-extrabold text-[#4E5363] transition hover:bg-[#F5F7FF]"
              >
                <X className="h-4 w-4" />
                Batal
              </button>
              <button
                type="button"
                disabled={isSubmitting}
                onClick={() => submitKegiatan('DRAFT')}
                className="inline-flex h-12 items-center justify-center gap-2 rounded-xl border border-[#C8CEE0] bg-[#EEF3FF] px-6 text-sm font-extrabold text-[#0D329D] transition hover:bg-[#DDE5FF]"
              >
                <Save className="h-4 w-4" />
                {isSubmitting ? 'Menyimpan...' : 'Simpan Draft'}
              </button>
              <Button type="submit" className="h-12 px-7" disabled={isSubmitting}>
                <CheckCircle2 className="h-4 w-4" />
                {isSubmitting ? 'Menyimpan...' : 'Simpan Perubahan'}
              </Button>
            </div>
          </>
        ) : null}
      </form>
    </EOLayout>
  )
}

export default EditKegiatanPage
