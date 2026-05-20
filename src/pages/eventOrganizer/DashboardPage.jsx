import {
  BookmarkCheck,
  CalendarDays,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Edit3,
  Eye,
  FileText,
  Filter,
  LogOut,
  Medal,
  Plus,
  Search,
  Trash2,
  UserRound,
  Zap,
} from 'lucide-react'
import { NavLink, useNavigate } from 'react-router-dom'

const menuItems = [
  { label: 'Kegiatan', path: '/event-organizer/dashboard', icon: BookmarkCheck },
  { label: 'Kelola Pendaftaran', path: '/event-organizer/events', icon: CalendarDays },
  { label: 'Riwayat', path: '/event-organizer/peserta', icon: FileText },
  { label: 'Sertifikat', path: '/event-organizer/verifikasi', icon: Medal },
]

const stats = [
  { label: 'Total Kegiatan', value: '12', icon: BookmarkCheck, tone: 'primary' },
  { label: 'Kegiatan Aktif', value: '08', icon: Zap, tone: 'blue' },
  { label: 'Draft Kegiatan', value: '04', icon: Edit3, tone: 'gray' },
]

const events = [
  {
    id: 1,
    title: 'Seminar Nasional AI 2024',
    category: 'Seminar',
    date: '24 Okt 2023',
    registrants: 124,
    status: 'Aktif',
    statusTone: 'active',
    points: '5 TAK Points',
    image: 'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?auto=format&fit=crop&w=120&q=80',
  },
  {
    id: 2,
    title: 'Workshop Advanced UI/UX',
    category: 'Workshop',
    date: '28 Okt 2023',
    registrants: 45,
    status: 'Draft',
    statusTone: 'draft',
    points: '8 TAK Points',
    image: '',
  },
  {
    id: 3,
    title: 'Lomba Karya Tulis Ilmiah',
    category: 'Lomba',
    date: '15 Nov 2023',
    registrants: 32,
    status: 'Selesai',
    statusTone: 'done',
    points: '10 TAK Points',
    image: '',
  },
]

function EventOrganizerDashboardPage() {
  const navigate = useNavigate()

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    navigate('/login')
  }

  return (
    <div className="eo-page">
      <aside className="eo-sidebar">
        <div className="eo-brand">
          <p className="eo-brand-title">TAK Hub</p>
          <p className="eo-brand-subtitle">Sistem Informasi Kegiatan</p>
        </div>

        <nav className="eo-nav">
          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => `eo-nav-link${isActive ? ' active' : ''}`}
            >
              <item.icon className="eo-nav-icon" strokeWidth={2.3} />
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>

        <button type="button" className="eo-logout" onClick={handleLogout}>
          <LogOut className="eo-logout-icon" strokeWidth={2.2} />
          Keluar
        </button>
      </aside>

      <div className="eo-content">
        <header className="eo-topbar">
          <h1>Kegiatan Event Organizer</h1>

          <div className="eo-topbar-actions">
            <div className="eo-search">
              <Search className="eo-search-icon" strokeWidth={2.1} />
              <input type="text" placeholder="Cari bookmark..." />
            </div>
            <button type="button" className="eo-profile-button" aria-label="Profil">
              <UserRound className="eo-profile-icon" strokeWidth={2.2} />
            </button>
          </div>
        </header>

        <main className="eo-main">
          <section className="eo-hero-row">
            <div>
              <h2>Kelola Kegiatan</h2>
              <p>Kelola dan buat kegiatan akademik baru untuk mahasiswa secara efisien dan transparan.</p>
            </div>

            <button type="button" className="eo-add-button">
              <Plus className="eo-add-icon" strokeWidth={2.4} />
              <span>
                Tambah Kegiatan
                <br />
                Baru
              </span>
            </button>
          </section>

          <section className="eo-stats">
            {stats.map((item) => (
              <div key={item.label} className="eo-stat-card">
                <div>
                  <p>{item.label}</p>
                  <strong>{item.value}</strong>
                </div>
                <span className={`eo-stat-icon ${item.tone}`}>
                  <item.icon strokeWidth={2.3} />
                </span>
              </div>
            ))}
          </section>

          <section className="eo-table-card">
            <div className="eo-filters">
              <div className="eo-filter-group">
                <button type="button" className="eo-filter-button">
                  <span>
                    <Filter className="eo-filter-icon" strokeWidth={2.1} />
                    Semua Kategori
                  </span>
                  <ChevronDown className="eo-chevron-icon" strokeWidth={2.1} />
                </button>

                <button type="button" className="eo-filter-button">
                  <span>
                    <CalendarDays className="eo-filter-icon" strokeWidth={2.1} />
                    Urutkan Tanggal
                  </span>
                  <ChevronDown className="eo-chevron-icon" strokeWidth={2.1} />
                </button>
              </div>

              <p>Menampilkan 8 dari 12 kegiatan</p>
            </div>

            <div className="eo-table-wrap">
              <table className="eo-table">
                <thead>
                  <tr>
                    <th>Nama Kegiatan</th>
                    <th>Kategori</th>
                    <th>Tanggal</th>
                    <th>Pendaftar</th>
                    <th>Status</th>
                    <th>Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {events.map((event, index) => (
                    <tr key={event.id} className={index === 1 ? 'muted' : ''}>
                      <td>
                        <div className="eo-event-name">
                          {event.image ? (
                            <img src={event.image} alt={event.title} />
                          ) : (
                            <span className="eo-image-placeholder">
                              <FileText strokeWidth={2} />
                            </span>
                          )}
                          <div>
                            <strong>{event.title}</strong>
                            <small>{event.points}</small>
                          </div>
                        </div>
                      </td>
                      <td>
                        <span className="eo-category-pill">{event.category}</span>
                      </td>
                      <td className="eo-date-cell">{event.date}</td>
                      <td className="eo-registrant-cell">
                        <strong>{event.registrants}</strong>
                        <small>Mahasiswa</small>
                      </td>
                      <td>
                        <span className={`eo-status-pill ${event.statusTone}`}>
                          <span />
                          {event.status}
                        </span>
                      </td>
                      <td>
                        <div className="eo-action-buttons">
                          <button type="button" aria-label="Edit kegiatan">
                            <Edit3 strokeWidth={2.2} />
                          </button>
                          <button type="button" aria-label="Lihat kegiatan">
                            <Eye strokeWidth={2.2} />
                          </button>
                          <button type="button" className="danger" aria-label="Hapus kegiatan">
                            <Trash2 strokeWidth={2.2} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="eo-pagination">
              <p>Halaman 1 dari 3</p>
              <div>
                <button type="button" className="disabled" aria-label="Halaman sebelumnya">
                  <ChevronLeft strokeWidth={2.2} />
                </button>
                <button type="button" className="current">1</button>
                <button type="button">2</button>
                <button type="button">3</button>
                <button type="button" aria-label="Halaman berikutnya">
                  <ChevronRight strokeWidth={2.2} />
                </button>
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  )
}

export default EventOrganizerDashboardPage
