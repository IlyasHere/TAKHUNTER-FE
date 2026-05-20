import { Award, Bookmark, CalendarCheck, Compass, History, LogOut, X } from 'lucide-react'
import { NavLink, useLocation, useNavigate } from 'react-router-dom'

const menuItems = [
  { label: 'Kegiatan', path: '/kegiatan', icon: Compass },
  { label: 'Bookmark', path: '/bookmark', icon: Bookmark },
  { label: 'Riwayat', path: '/riwayat', icon: History },
  { label: 'Sertifikat', path: '/sertifikat', icon: Award },
]

function Sidebar({ isOpen = false, onClose }) {
  const location = useLocation()
  const navigate = useNavigate()

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    onClose?.()
    navigate('/login')
  }

  return (
    <>
      <div
        className={`fixed inset-0 z-30 bg-slate-950/45 backdrop-blur-sm transition-opacity lg:hidden ${
          isOpen ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'
        }`}
        onClick={onClose}
      />

      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-[260px] flex-col bg-gradient-to-b from-[#254BD6] to-[#183892] text-white shadow-2xl transition-transform duration-300 lg:z-30 lg:translate-x-0 lg:shadow-none ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-start justify-between px-6 pb-8 pt-7">
          <NavLink to="/dashboard" onClick={onClose}>
            <p className="text-[22px] font-extrabold leading-none tracking-wide">TAK Hub</p>
            <p className="mt-3 text-sm font-medium text-white">Sistem Informasi Kegiatan</p>
          </NavLink>
          <button
            className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/10 text-white transition hover:bg-white/20 lg:hidden"
            type="button"
            onClick={onClose}
            aria-label="Tutup menu"
          >
            <X className="h-5 w-5" strokeWidth={2.2} />
          </button>
        </div>

        <nav className="space-y-2 px-3">
          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={onClose}
              className={({ isActive }) => {
                const active = isActive || (location.pathname === '/dashboard' && item.path === '/kegiatan')

                return `flex h-11 items-center gap-3 rounded-none border-l-4 px-4 text-[14px] font-medium transition ${
                  active
                    ? 'border-[#205BFF] bg-white/12 text-white'
                    : 'border-transparent text-white hover:bg-white/10'
                }`
              }}
            >
              <item.icon className="h-[19px] w-[19px]" strokeWidth={2.1} />
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>

        <button
          type="button"
          onClick={handleLogout}
          className="mx-5 mb-8 mt-auto flex h-11 items-center gap-3 rounded-lg px-4 text-sm font-medium text-white transition hover:bg-white/10"
        >
          <LogOut className="h-5 w-5" strokeWidth={2.1} />
          <span>Keluar</span>
        </button>
      </aside>
    </>
  )
}

export default Sidebar
