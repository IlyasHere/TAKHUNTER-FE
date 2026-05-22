import { ArrowLeft, Camera, Info, Mail, Pencil, Save, ShieldCheck, Upload, UserRound, X } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import DashboardLayout from '../../components/layout/DashboardLayout'
import EOLayout from '../event-organizer/components/EOLayout'
import { updateProfile } from '../../services/profileService'
import { buildAssetUrl, getStoredUser, notifyProfileUpdated } from '../../utils/userProfile'

const getRoleLabel = (role) => {
  if (role === 'EVENT_ORGANIZER') return 'Event Organizer'
  if (role === 'MAHASISWA') return 'Mahasiswa'
  return role || 'User'
}

const getStatusLabel = (role) => {
  if (role === 'EVENT_ORGANIZER') return 'Event Organizer Terverifikasi'
  return 'Mahasiswa Aktif - S1 Informatika'
}

function ProfileContent({ role = 'MAHASISWA' }) {
  const navigate = useNavigate()
  const storedUser = useMemo(() => getStoredUser(), [])
  const [form, setForm] = useState({
    name: storedUser?.name || '',
    email: storedUser?.email || '',
  })
  const [currentUser, setCurrentUser] = useState(storedUser)
  const [photoFile, setPhotoFile] = useState(null)
  const [photoPreview, setPhotoPreview] = useState(buildAssetUrl(storedUser?.profilePhotoPath || storedUser?.profilePhotoUrl || ''))
  const [isEditing, setIsEditing] = useState(false)
  const [statusMessage, setStatusMessage] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    if (!photoFile) return undefined

    const objectUrl = URL.createObjectURL(photoFile)
    setPhotoPreview(objectUrl)

    return () => URL.revokeObjectURL(objectUrl)
  }, [photoFile])

  const roleLabel = getRoleLabel(currentUser?.role || role)
  const statusLabel = getStatusLabel(currentUser?.role || role)
  const initials = (form.name || roleLabel)
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('')

  const handleChange = (event) => {
    const { name, value } = event.target
    setForm((currentForm) => ({ ...currentForm, [name]: value }))
    setStatusMessage('')
    setErrorMessage('')
  }

  const handlePhotoChange = (event) => {
    const file = event.target.files?.[0]
    setStatusMessage('')
    setErrorMessage('')

    if (!file) return
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      setErrorMessage('Foto profil wajib JPG, PNG, atau WEBP.')
      return
    }
    if (file.size > 2 * 1024 * 1024) {
      setErrorMessage('Ukuran foto profil maksimal 2 MB.')
      return
    }

    setIsEditing(true)
    setPhotoFile(file)
  }

  const resetForm = () => {
    const latestUser = getStoredUser()
    setCurrentUser(latestUser)
    setForm({
      name: latestUser?.name || '',
      email: latestUser?.email || '',
    })
    setPhotoFile(null)
    setPhotoPreview(buildAssetUrl(latestUser?.profilePhotoPath || latestUser?.profilePhotoUrl || ''))
    setStatusMessage('')
    setErrorMessage('')
  }

  const handleCancel = () => {
    resetForm()
    setIsEditing(false)
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setStatusMessage('')
    setErrorMessage('')

    if (!form.name.trim() || !form.email.trim()) {
      setErrorMessage('Nama dan email wajib diisi.')
      return
    }

    try {
      setIsSaving(true)
      const data = await updateProfile({
        name: form.name.trim(),
        email: form.email.trim(),
        profilePhoto: photoFile,
      })

      if (data?.token) {
        localStorage.setItem('token', data.token)
      }
      if (data?.user) {
        localStorage.setItem('user', JSON.stringify(data.user))
        setCurrentUser(data.user)
        setPhotoPreview(buildAssetUrl(data.user.profilePhotoPath || data.user.profilePhotoUrl || ''))
        notifyProfileUpdated()
      }

      setPhotoFile(null)
      setIsEditing(false)
      setStatusMessage('Profil berhasil diperbarui.')
    } catch (error) {
      setErrorMessage(error.message || 'Gagal memperbarui profil.')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="mx-auto max-w-[980px]">
      <div className="mb-7 flex items-center gap-3 text-[#0D329D]">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="flex h-9 w-9 items-center justify-center rounded-full transition hover:bg-[#E9EFFF]"
          aria-label="Kembali"
        >
          <ArrowLeft className="h-5 w-5" strokeWidth={2.4} />
        </button>
        <span className="text-sm font-extrabold text-[#171B29]">Manajemen Profil</span>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h2 className="text-[30px] font-black leading-tight text-[#171B29]">Manajemen Profil</h2>
            <p className="mt-2 max-w-2xl text-sm font-medium leading-relaxed text-[#6D7589]">
              Perbarui foto profil dan informasi dasar akun Anda untuk mempersonalisasi pengalaman di platform TAK Hub.
            </p>
          </div>

          {isEditing ? (
            <div className="flex shrink-0 gap-3">
              <button
                type="button"
                onClick={handleCancel}
                className="inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-[#CDD5E8] bg-white px-4 text-xs font-extrabold text-[#4E5363] transition hover:bg-[#F6F8FC]"
                disabled={isSaving}
              >
                <X className="h-4 w-4" strokeWidth={2.6} />
                Batal
              </button>
              <button
                type="submit"
                className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-[#003B9D] px-4 text-xs font-extrabold text-white shadow-[0_12px_24px_rgba(0,59,157,0.20)] transition hover:bg-[#002F7D] disabled:cursor-not-allowed disabled:opacity-70"
                disabled={isSaving}
              >
                <Save className="h-4 w-4" strokeWidth={2.6} />
                {isSaving ? 'Menyimpan...' : 'Simpan'}
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setIsEditing(true)}
              className="inline-flex h-10 shrink-0 items-center justify-center gap-2 rounded-lg bg-[#003B9D] px-4 text-xs font-extrabold text-white shadow-[0_12px_24px_rgba(0,59,157,0.20)] transition hover:bg-[#002F7D]"
            >
              <Pencil className="h-4 w-4" strokeWidth={2.6} />
              Edit Profil
            </button>
          )}
        </div>

        <div className="grid gap-5 lg:grid-cols-[315px_1fr]">
          <section className="rounded-xl border border-[#E7EBF4] bg-white p-7 text-center shadow-[0_14px_34px_rgba(20,36,82,0.06)]">
            <div className="mx-auto flex h-[170px] w-[170px] items-center justify-center rounded-full border-4 border-[#CFE0FF] bg-[#F4F7FF] p-2">
              <div className="relative flex h-full w-full items-center justify-center overflow-hidden rounded-full bg-[#EAF0FF] text-[#0D329D]">
                {photoPreview ? (
                  <img src={photoPreview} alt={form.name || 'Foto profil'} className="h-full w-full object-cover" />
                ) : (
                  <span className="text-[42px] font-black">{initials || 'U'}</span>
                )}
                {isEditing ? (
                  <label className="absolute inset-x-0 bottom-0 flex h-11 cursor-pointer items-center justify-center gap-2 bg-[#003B9D]/85 text-xs font-extrabold text-white backdrop-blur-sm">
                    <Camera className="h-4 w-4" strokeWidth={2.6} />
                    Ganti
                    <input type="file" accept="image/png,image/jpeg,image/jpg,image/webp" className="sr-only" onChange={handlePhotoChange} />
                  </label>
                ) : null}
              </div>
            </div>

            <h3 className="mt-6 text-[18px] font-black text-[#171B29]">Foto Profil</h3>
            <p className="mx-auto mt-2 max-w-[220px] text-sm font-medium leading-relaxed text-[#657087]">
              Pastikan foto Anda wajah tegak lurus, rapi, dan memiliki pencahayaan yang cukup.
            </p>
            {isEditing ? (
              <label className="mt-5 inline-flex h-10 cursor-pointer items-center justify-center gap-2 rounded-lg border border-[#CDD5E8] bg-white px-4 text-xs font-extrabold text-[#003B9D] transition hover:bg-[#F5F7FF]">
                <Upload className="h-4 w-4" strokeWidth={2.5} />
                Pilih Foto
                <input type="file" accept="image/png,image/jpeg,image/jpg,image/webp" className="sr-only" onChange={handlePhotoChange} />
              </label>
            ) : null}
          </section>

          <section className="rounded-xl border border-[#E7EBF4] bg-white p-7 shadow-[0_14px_34px_rgba(20,36,82,0.06)]">
            <div className="mb-7 flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-[#EEF4FF] text-[#003B9D]">
                <UserRound className="h-5 w-5" strokeWidth={2.5} />
              </div>
              <h3 className="text-[20px] font-black text-[#171B29]">Informasi Akun</h3>
            </div>

            <div className="grid gap-5">
              <label className="block">
                <span className="mb-2 block text-xs font-extrabold text-[#69748A]">Nama Lengkap</span>
                <div className="flex h-13 min-h-[52px] items-center rounded-lg bg-[#F0F3F8] px-4 text-[#293044] focus-within:ring-2 focus-within:ring-[#CFE0FF]">
                  <UserRound className="mr-3 h-5 w-5 text-[#748097]" strokeWidth={2.1} />
                  <input
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    readOnly={!isEditing}
                    className="h-full min-w-0 flex-1 bg-transparent text-sm font-semibold outline-none placeholder:text-[#9AA3B5] read-only:cursor-default"
                    placeholder="Masukkan nama"
                    autoComplete="name"
                  />
                </div>
              </label>

              <label className="block">
                <span className="mb-2 block text-xs font-extrabold text-[#69748A]">Alamat Email</span>
                <div className="flex h-13 min-h-[52px] items-center rounded-lg bg-[#F0F3F8] px-4 text-[#293044] focus-within:ring-2 focus-within:ring-[#CFE0FF]">
                  <Mail className="mr-3 h-5 w-5 text-[#748097]" strokeWidth={2.1} />
                  <input
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={handleChange}
                    readOnly={!isEditing}
                    className="h-full min-w-0 flex-1 bg-transparent text-sm font-semibold outline-none placeholder:text-[#9AA3B5] read-only:cursor-default"
                    placeholder="Masukkan email"
                    autoComplete="email"
                  />
                </div>
              </label>

              <div>
                <span className="mb-2 block text-xs font-extrabold text-[#69748A]">Status {roleLabel}</span>
                <div className="flex min-h-[52px] items-center justify-between gap-3 rounded-lg bg-[#F4F7FD] px-4 text-[#003B9D]">
                  <div className="flex min-w-0 items-center gap-3">
                    <ShieldCheck className="h-5 w-5 shrink-0" strokeWidth={2.1} />
                    <span className="truncate text-sm font-semibold">{statusLabel}</span>
                  </div>
                  <span className="shrink-0 rounded-full bg-[#E7ECF5] px-3 py-1 text-[10px] font-black uppercase text-[#9BA4B7]">Verified</span>
                </div>
              </div>
            </div>

            {errorMessage ? <p className="mt-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-bold text-red-600">{errorMessage}</p> : null}
            {statusMessage ? <p className="mt-5 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-bold text-emerald-700">{statusMessage}</p> : null}
          </section>
        </div>
      </form>

      <div className="mt-6 flex gap-3 rounded-lg border border-[#CFE0FF] bg-[#E8F1FF] px-5 py-4 text-[#003B9D]">
        <Info className="mt-0.5 h-5 w-5 shrink-0" strokeWidth={2.3} />
        <div>
          <p className="text-sm font-black">Informasi Keamanan</p>
          <p className="mt-1 text-xs font-medium leading-relaxed text-[#3B5D9B]">
            Perubahan pada email akan memerlukan verifikasi ulang melalui kotak masuk email baru Anda. Pastikan email yang Anda masukkan sudah benar.
          </p>
        </div>
      </div>
    </div>
  )
}

function ProfilePage({ role = 'MAHASISWA' }) {
  const storedUser = getStoredUser()

  if (role === 'EVENT_ORGANIZER') {
    return (
      <EOLayout title="Manajemen Profil" organizerName={storedUser?.name || 'Event Organizer'}>
        <ProfileContent role={role} />
      </EOLayout>
    )
  }

  return (
    <DashboardLayout title="Manajemen Profil" searchPlaceholder="Cari profil...">
      <ProfileContent role={role} />
    </DashboardLayout>
  )
}

export default ProfilePage
