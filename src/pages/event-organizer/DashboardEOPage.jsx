import { FilePenLine, ListChecks, Plus, Zap } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { checkAuth } from '../../services/authService'
import EOEventsTable from './components/EOEventsTable'
import EOLayout from './components/EOLayout'
import EOStatCard from './components/EOStatCard'

const getStoredUser = () => {
  try {
    return JSON.parse(localStorage.getItem('user')) || null
  } catch {
    return null
  }
}

function DashboardEOPage() {
  const navigate = useNavigate()
  const [organizerName, setOrganizerName] = useState(getStoredUser()?.name || 'Event Organizer')

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

  return (
    <EOLayout title="Kegiatan Event Organizer" organizerName={organizerName}>
      <section className="mb-5 flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
        <div>
          <p className="text-sm font-bold text-[#4E5363]">Halo, {organizerName}</p>
          <h2 className="mt-2 text-[34px] font-extrabold leading-none text-[#0D329D]">Kelola Kegiatan</h2>
          <p className="mt-2 max-w-[680px] text-[20px] leading-snug text-[#4E5363]">
            Kelola dan buat kegiatan akademik baru untuk mahasiswa secara efisien dan transparan.
          </p>
        </div>

        <button
          type="button"
          className="flex h-20 w-full items-center justify-center gap-6 rounded-lg bg-[#0D329D] px-8 text-[17px] font-extrabold text-white shadow-[0_14px_28px_rgba(13,50,157,0.18)] transition hover:bg-[#09277D] xl:w-[252px]"
        >
          <Plus className="h-7 w-7" strokeWidth={2.2} />
          <span>
            Tambah Kegiatan
            <br />
            Baru
          </span>
        </button>
      </section>

      <section className="grid gap-6 lg:grid-cols-3">
        <EOStatCard label="Total Kegiatan" value="12" icon={ListChecks} tone="indigo" />
        <EOStatCard label="Kegiatan Aktif" value="08" icon={Zap} tone="blue" />
        <EOStatCard label="Draft Kegiatan" value="04" icon={FilePenLine} tone="gray" />
      </section>

      <div className="mt-4">
        <EOEventsTable />
      </div>
    </EOLayout>
  )
}

export default DashboardEOPage
