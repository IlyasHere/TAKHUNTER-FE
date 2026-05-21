import { ArrowLeft, CalendarDays, CheckCircle2, Clock, CloudUpload, FileText, Info, MapPin, Save, Sparkles, Ticket, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Button from '../../components/ui/Button'
import { checkAuth } from '../../services/authService'
import { createKegiatan } from '../../services/kegiatanService'
import EOLayout from './components/EOLayout'

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
const ALLOWED_BANNER_TYPES = ['image/jpeg', 'image/png', 'image/webp']
const CATEGORY_OPTIONS = [
  { value: 'SEMINAR', label: 'Seminar' },
  { value: 'LOMBA', label: 'Lomba' },
  { value: 'WEBINAR', label: 'Webinar' },
  { value: 'PELATIHAN', label: 'Pelatihan' },
]
const STATUS_OPTIONS = ['DRAFT', 'AKTIF']

const requiredFields = {
  namaKegiatan: 'Nama kegiatan wajib diisi.',
  deskripsi: 'Deskripsi wajib diisi.',
  kategori: 'Kategori wajib dipilih.',
  poinTak: 'Poin TAK wajib diisi.',
  tanggal: 'Tanggal kegiatan wajib diisi.',
  waktu: 'Waktu kegiatan wajib diisi.',
  lokasi: 'Lokasi wajib diisi.',
  batasPendaftaran: 'Batas pendaftaran wajib diisi.',
}

const isValidOptionalQuota = (value) => {
  if (value === '') return true

  const quota = Number(value)
  return Number.isInteger(quota) && quota >= 1
}

const isValidDateValue = (value) => /^\d{4}-\d{2}-\d{2}$/.test(value) && !Number.isNaN(new Date(`${value}T00:00:00`).getTime())

const isValidTimeValue = (value) => /^\d{2}:\d{2}$/.test(value)

const isValidPointValue = (value) => {
  if (value === '') return false

  const point = Number(value)
  return Number.isFinite(point) && point >= 0
}

function Field({ label, required = false, children, className = '', error = '' }) {
  return (
    <label className={`block ${className}`}>
      <span className="text-sm font-extrabold text-[#1D2230]">
        {label} {required ? <span className="text-[#DC1717]">*</span> : null}
      </span>
      <div className="mt-2">{children}</div>
      {error ? <p className="mt-2 text-xs font-extrabold text-[#DC1717]">{error}</p> : null}
    </label>
  )
}

function fieldClass(extra = '', hasError = false) {
  return `h-[58px] w-full rounded-2xl border ${hasError ? 'border-[#DC1717] bg-[#FFF7F7] focus:border-[#DC1717] focus:ring-[#FFE1E1]' : 'border-[#B9C0D3] bg-[#F8F8FF] focus:border-[#0D329D] focus:ring-[#DDE5FF]'} px-5 text-[16px] font-semibold text-[#202433] outline-none transition placeholder:text-[#747B8E] focus:bg-white focus:ring-4 ${extra}`
}

function AddKegiatanPage() {
  const navigate = useNavigate()
  const [organizerName, setOrganizerName] = useState(getStoredUser()?.name || 'Event Organizer')
  const [isMandatory, setIsMandatory] = useState(false)
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
  const [bannerFile, setBannerFile] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [debugError, setDebugError] = useState(null)
  const [fieldErrors, setFieldErrors] = useState({})

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
          return
        }

        localStorage.setItem('user', JSON.stringify(user))
        setOrganizerName(user.name || 'Event Organizer')
      })
      .catch(() => {
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        navigate('/login', { replace: true })
      })
  }, [navigate])

  const handleChange = (event) => {
    const { name, value } = event.target
    setForm((currentForm) => ({ ...currentForm, [name]: value }))
    setFieldErrors((currentErrors) => ({ ...currentErrors, [name]: '' }))
    setErrorMessage('')
    setDebugError(null)
  }

  const handleBannerChange = (event) => {
    const file = event.target.files?.[0]

    setFieldErrors((currentErrors) => ({ ...currentErrors, banner: '' }))

    if (file && !ALLOWED_BANNER_TYPES.includes(file.type)) {
      event.target.value = ''
      setBannerFile(null)
      setFieldErrors((currentErrors) => ({
        ...currentErrors,
        banner: 'Banner harus berupa gambar JPG, PNG, atau WebP.',
      }))
      setErrorMessage('Periksa kembali banner yang diunggah.')
      setDebugError(null)
      return
    }

    if (file && file.size > MAX_BANNER_SIZE_BYTES) {
      event.target.value = ''
      setBannerFile(null)
      setFieldErrors((currentErrors) => ({
        ...currentErrors,
        banner: `Ukuran banner maksimal ${MAX_BANNER_SIZE_MB}MB.`,
      }))
      setErrorMessage('Periksa kembali banner yang diunggah.')
      setDebugError(null)
      return
    }

    setErrorMessage('')
    setDebugError(null)
    setBannerFile(file || null)
  }

  const validateForm = (statusPublikasi) => {
    const errors = {}

    Object.entries(requiredFields).forEach(([fieldName, message]) => {
      if (!String(form[fieldName] || '').trim()) {
        errors[fieldName] = message
      }
    })

    if (form.kategori && !CATEGORY_OPTIONS.some((option) => option.value === form.kategori)) {
      errors.kategori = 'Kategori harus dipilih dari daftar yang tersedia.'
    }

    if (form.poinTak !== '' && !isValidPointValue(form.poinTak)) {
      errors.poinTak = 'Poin TAK harus berupa angka minimal 0.'
    }

    if (form.kuotaPeserta !== '' && !isValidOptionalQuota(form.kuotaPeserta)) {
      errors.kuotaPeserta = 'Kuota peserta harus berupa angka bulat minimal 1 jika diisi.'
    }

    if (form.tanggal && !isValidDateValue(form.tanggal)) {
      errors.tanggal = 'Tanggal kegiatan harus memakai format YYYY-MM-DD.'
    }

    if (form.batasPendaftaran && !isValidDateValue(form.batasPendaftaran)) {
      errors.batasPendaftaran = 'Batas pendaftaran harus memakai format YYYY-MM-DD.'
    }

    if (form.tanggal && form.batasPendaftaran && isValidDateValue(form.tanggal) && isValidDateValue(form.batasPendaftaran) && form.batasPendaftaran > form.tanggal) {
      errors.batasPendaftaran = 'Batas pendaftaran tidak boleh setelah tanggal kegiatan.'
    }

    if (form.waktu && !isValidTimeValue(form.waktu)) {
      errors.waktu = 'Waktu kegiatan harus valid, misalnya 09:00.'
    }

    if (!STATUS_OPTIONS.includes(statusPublikasi)) {
      errors.statusPublikasi = 'Status publikasi hanya boleh DRAFT atau AKTIF.'
    }

    if (bannerFile && !ALLOWED_BANNER_TYPES.includes(bannerFile.type)) {
      errors.banner = 'Banner harus berupa gambar JPG, PNG, atau WebP.'
    }

    if (bannerFile && bannerFile.size > MAX_BANNER_SIZE_BYTES) {
      errors.banner = `Ukuran banner maksimal ${MAX_BANNER_SIZE_MB}MB.`
    }

    return errors
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
    setFieldErrors({})

    const validationErrors = validateForm(statusPublikasi)

    if (Object.keys(validationErrors).length > 0) {
      setIsSubmitting(false)
      setFieldErrors(validationErrors)
      setErrorMessage('Periksa kembali field yang masih kosong atau belum valid.')
      return
    }

    try {
      await createKegiatan(buildPayload(statusPublikasi))
      sessionStorage.setItem(EO_TOAST_STORAGE_KEY, statusPublikasi === 'DRAFT' ? 'Draft kegiatan berhasil disimpan.' : 'Kegiatan berhasil ditambahkan.')
      navigate('/event-organizer/dashboard')
    } catch (error) {
      setErrorMessage(error.message || 'Gagal menyimpan kegiatan.')
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
    <EOLayout title="Tambah Kegiatan" organizerName={organizerName}>
      <form onSubmit={handleSubmit} className="mx-auto max-w-[1120px]" noValidate>
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
            <h2 className="text-[32px] font-extrabold leading-tight text-[#0D329D]">Formulir Pendaftaran Kegiatan</h2>
            <p className="mt-2 max-w-[760px] text-[18px] leading-relaxed text-[#555B68]">
              Lengkapi detail kegiatan untuk mempublikasikan kegiatan baru ke seluruh mahasiswa.
            </p>
          </div>

          <div className="rounded-2xl border border-[#DDE5FF] bg-white px-5 py-4 shadow-sm">
            <p className="flex items-center gap-2 text-sm font-extrabold text-[#0D329D]">
              <Sparkles className="h-4 w-4" />
              Draft otomatis
            </p>
            <p className="mt-1 text-xs font-semibold text-[#747B8E]">Data bisa disimpan sebagai draft sebelum dipublikasi.</p>
          </div>
        </section>

        <section className="rounded-[24px] border border-[#E0E5F2] bg-white p-7 shadow-[0_18px_45px_rgba(28,42,91,0.06)] lg:p-8">
          <div className="mb-6 flex items-center gap-4 border-b border-[#E6EAF4] pb-5">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#EEF3FF] text-[#4758E0]">
              <Info className="h-5 w-5" strokeWidth={2.4} />
            </div>
            <h3 className="text-[26px] font-extrabold text-[#161A27]">Info Umum</h3>
          </div>

          <div className="grid gap-6">
            <Field label="Nama Kegiatan" required error={fieldErrors.namaKegiatan}>
              <input className={fieldClass('', Boolean(fieldErrors.namaKegiatan))} name="namaKegiatan" value={form.namaKegiatan} onChange={handleChange} placeholder="Masukkan nama kegiatan" required />
            </Field>

            <Field label="Deskripsi" required error={fieldErrors.deskripsi}>
              <textarea
                className={fieldClass('min-h-[120px] resize-none py-4', Boolean(fieldErrors.deskripsi))}
                name="deskripsi"
                value={form.deskripsi}
                onChange={handleChange}
                placeholder="Jelaskan detail kegiatan, manfaat, dan ketentuan peserta..."
                required
              />
            </Field>

            <div className="grid gap-6 lg:grid-cols-2">
              <Field label="Kategori" required error={fieldErrors.kategori}>
                <select className={fieldClass('appearance-none bg-[linear-gradient(45deg,transparent_50%,#747B8E_50%),linear-gradient(135deg,#747B8E_50%,transparent_50%)] bg-[length:7px_7px,7px_7px] bg-[position:calc(100%-24px)_25px,calc(100%-18px)_25px] bg-no-repeat', Boolean(fieldErrors.kategori))} name="kategori" value={form.kategori} onChange={handleChange} required>
                  <option value="" disabled>Pilih Kategori</option>
                  {CATEGORY_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
              </Field>

              <Field label="Poin TAK" required error={fieldErrors.poinTak}>
                <div className="relative">
                  <Ticket className="pointer-events-none absolute left-5 top-1/2 h-5 w-5 -translate-y-1/2 text-[#4758E0]" strokeWidth={2.2} />
                  <input className={fieldClass('pl-12', Boolean(fieldErrors.poinTak))} name="poinTak" value={form.poinTak} onChange={handleChange} type="number" min="0" step="1" placeholder="0" required />
                </div>
              </Field>
            </div>

            <Field label="Status Wajib" required>
              <button
                type="button"
                onClick={() => setIsMandatory((value) => !value)}
                className="flex items-center gap-4 text-[16px] font-semibold text-[#202433]"
              >
                <span className={`flex h-[30px] w-[56px] items-center rounded-full p-1 transition ${isMandatory ? 'bg-[#4758E0]' : 'bg-[#DDE2F0]'}`}>
                  <span className={`h-6 w-6 rounded-full bg-white shadow transition ${isMandatory ? 'translate-x-[26px]' : 'translate-x-0'}`} />
                </span>
                Wajib
              </button>
            </Field>

            <Field label="Unggah Banner Kegiatan" error={fieldErrors.banner}>
              <label className={`flex min-h-[190px] cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed px-6 text-center transition hover:border-[#4758E0] hover:bg-[#EEF3FF] ${fieldErrors.banner ? 'border-[#DC1717] bg-[#FFF7F7]' : 'border-[#C7CCE0] bg-[#F1F4FF]'}`}>
                <CloudUpload className="h-12 w-12 text-[#3349D8]" strokeWidth={2.5} />
                <span className="mt-5 text-[20px] font-semibold text-[#555B68]">
                  {bannerFile ? bannerFile.name : 'Klik atau tarik file di sini untuk mengunggah banner'}
                </span>
                <span className="mt-2 text-[18px] font-semibold text-[#747B8E]">Format: JPG, PNG, WebP (Maks. {MAX_BANNER_SIZE_MB}MB)</span>
                <input type="file" name="banner" accept="image/png,image/jpeg,image/jpg,image/webp" className="sr-only" onChange={handleBannerChange} />
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
            <Field label="Tanggal" required error={fieldErrors.tanggal}>
              <div className="relative">
                <CalendarDays className="pointer-events-none absolute left-5 top-1/2 h-5 w-5 -translate-y-1/2 text-[#4758E0]" />
                <input className={fieldClass('pl-12', Boolean(fieldErrors.tanggal))} name="tanggal" value={form.tanggal} onChange={handleChange} type="date" required />
              </div>
            </Field>
            <Field label="Waktu" required error={fieldErrors.waktu}>
              <div className="relative">
                <Clock className="pointer-events-none absolute left-5 top-1/2 h-5 w-5 -translate-y-1/2 text-[#4758E0]" />
                <input className={fieldClass('pl-12', Boolean(fieldErrors.waktu))} name="waktu" value={form.waktu} onChange={handleChange} type="time" required />
              </div>
            </Field>
            <Field label="Lokasi" required className="lg:col-span-2" error={fieldErrors.lokasi}>
              <div className="relative">
                <MapPin className="pointer-events-none absolute left-5 top-1/2 h-5 w-5 -translate-y-1/2 text-[#4758E0]" />
                <input className={fieldClass('pl-12', Boolean(fieldErrors.lokasi))} name="lokasi" value={form.lokasi} onChange={handleChange} placeholder="Ruang kelas / Tautan Zoom" required />
              </div>
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
            <Field label="Kuota Peserta" error={fieldErrors.kuotaPeserta}>
              <input className={fieldClass('', Boolean(fieldErrors.kuotaPeserta))} name="kuotaPeserta" value={form.kuotaPeserta} onChange={handleChange} type="number" min="1" step="1" placeholder="Opsional" />
            </Field>
            <Field label="Batas Pendaftaran" required error={fieldErrors.batasPendaftaran}>
              <input className={fieldClass('', Boolean(fieldErrors.batasPendaftaran))} name="batasPendaftaran" value={form.batasPendaftaran} onChange={handleChange} type="date" max={form.tanggal || undefined} required />
            </Field>
            <Field label="Status Publikasi" required error={fieldErrors.statusPublikasi}>
              <select className={fieldClass('', Boolean(fieldErrors.statusPublikasi))} name="statusPublikasi" value={form.statusPublikasi} onChange={handleChange} required>
                <option value="DRAFT">Draft</option>
                <option value="AKTIF">Aktif</option>
              </select>
            </Field>
          </div>
        </section>

        {errorMessage ? (
          <div className="mt-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-600">
            <p>{errorMessage}</p>
            {debugError ? (
              <pre className="mt-3 max-h-56 overflow-auto rounded-lg bg-white/80 p-3 text-xs font-semibold text-red-700">
{JSON.stringify(debugError, null, 2)}
              </pre>
            ) : null}
          </div>
        ) : null}

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
            {isSubmitting ? 'Menyimpan...' : 'Publikasikan Kegiatan'}
          </Button>
        </div>
      </form>
    </EOLayout>
  )
}

export default AddKegiatanPage
