import { Award, ClipboardCheck, Compass, History, LogOut, Menu, Search, UserRound } from 'lucide-react'
import { NavLink, useLocation, useNavigate } from 'react-router-dom'

const menuItems = [
  { label: 'Kegiatan', path: '/event-organizer/dashboard', icon: Compass },
  { label: 'Kelola Pendaftaran', path: '/event-organizer/pendaftaran', icon: ClipboardCheck },
  { label: 'Riwayat', path: '/event-organizer/riwayat', icon: History },
  { label: 'Sertifikat', path: '/event-organizer/sertifikat', icon: Award },
]

function EOLayout({ title, organizerName, children }) {
  const location = useLocation()
  const navigate = useNavigate()

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    navigate('/login')
  }

  return (
    <div className="min-h-screen bg-[#F7F7FD] font-sans text-[#161A27]">
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-[260px] flex-col bg-gradient-to-b from-[#254BD6] to-[#183892] text-white lg:flex">
        <div className="px-6 pb-8 pt-7">
          <p className="text-[22px] font-extrabold leading-none tracking-wide">TAK Hub</p>
          <p className="mt-3 text-sm font-medium text-white">Sistem Informasi Kegiatan</p>
        </div>

        <nav className="space-y-2 px-3">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path || (item.path === '/event-organizer/dashboard' && location.pathname.startsWith('/event-organizer/kegiatan'))

            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={`flex h-11 items-center gap-3 border-l-4 px-4 text-[14px] font-medium transition ${
                  isActive ? 'border-[#205BFF] bg-white/12 text-white' : 'border-transparent text-white hover:bg-white/10'
                }`}
              >
                <item.icon className="h-[19px] w-[19px]" strokeWidth={2.1} />
                <span>{item.label}</span>
              </NavLink>
            )
          })}
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

      <div className="min-h-screen lg:pl-[260px]">
        <header className="sticky top-0 z-20 flex h-[72px] items-center justify-between border-b border-[#DDE1EF] bg-white px-5 lg:px-8">
          <div className="flex min-w-0 items-center gap-3">
            <button
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[#CED3E5] bg-[#F8F8FF] text-[#161A27] transition hover:bg-[#EEF1FA] lg:hidden"
              type="button"
              aria-label="Buka menu"
            >
              <Menu className="h-5 w-5" strokeWidth={2.2} />
            </button>
            <h1 className="truncate text-[18px] font-extrabold text-[#161A27] sm:text-[20px]">{title}</h1>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden h-10 w-[258px] items-center rounded-xl border border-[#CED3E5] bg-[#F8F8FF] px-3 md:flex">
              <Search className="h-[19px] w-[19px] text-[#6F7485]" />
              <input
                type="text"
                placeholder="Cari bookmark..."
                className="h-full flex-1 bg-transparent px-3 text-sm font-medium text-[#202433] outline-none placeholder:text-[#777B8F]"
              />
            </div>
            <div className="hidden max-w-[180px] truncate text-right text-sm font-bold text-[#273044] xl:block">
              {organizerName}
            </div>
            <button className="flex h-10 w-10 items-center justify-center rounded-full border border-[#CED3E5] bg-[#EEF1FA] text-[#161A27]" type="button">
              <UserRound className="h-5 w-5" strokeWidth={2.1} />
            </button>
          </div>
        </header>

        <main className="px-5 py-8 lg:px-8">{children}</main>
      </div>
    </div>
  )
}

export default EOLayout
