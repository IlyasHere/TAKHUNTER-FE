import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'

import LoginPage from '../pages/auth/LoginPage'
import RegisterPage from '../pages/auth/RegisterPage'

import AddKegiatanPage from '../pages/event-organizer/AddKegiatanPage'
import DashboardEOPage from '../pages/event-organizer/DashboardEOPage'
import DetailKegiatanPage from '../pages/event-organizer/DetailKegiatanPage'
import EditKegiatanPage from '../pages/event-organizer/EditKegiatanPage'
import KelolaPendaftaranPage from '../pages/event-organizer/KelolaPendaftaranPage'
import RiwayatEOPage from '../pages/event-organizer/RiwayatEOPage'
import SertifikatEOPage from '../pages/event-organizer/SertifikatEOPage'

import BookmarkPage from '../pages/mahasiswa/BookmarkPage'
import DashboardPage from '../pages/mahasiswa/DashboardPage'
import KegiatanPage from '../pages/mahasiswa/KegiatanPage'
import RiwayatPage from '../pages/mahasiswa/RiwayatPage'
import SertifikatPage from '../pages/mahasiswa/SertifikatPage'
import ProfilePage from '../pages/profile/ProfilePage'

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Auth */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Mahasiswa */}
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/kegiatan" element={<DashboardPage />} />
        <Route path="/kegiatan/:id" element={<KegiatanPage />} />
        <Route path="/bookmark" element={<BookmarkPage />} />
        <Route path="/riwayat" element={<RiwayatPage />} />
        <Route path="/sertifikat" element={<SertifikatPage />} />
        <Route path="/profil" element={<ProfilePage />} />

        {/* Event Organizer */}
        <Route path="/event-organizer/dashboard" element={<DashboardEOPage />} />
        <Route path="/event-organizer/events" element={<DashboardEOPage />} />
        <Route path="/event-organizer/peserta" element={<DashboardEOPage />} />
        <Route path="/event-organizer/verifikasi" element={<DashboardEOPage />} />
        <Route path="/event-organizer/kegiatan" element={<DashboardEOPage />} />
        <Route path="/event-organizer/kegiatan/tambah" element={<AddKegiatanPage />} />
        <Route path="/event-organizer/kegiatan/:id" element={<DetailKegiatanPage />} />
        <Route path="/event-organizer/kegiatan/:id/edit" element={<EditKegiatanPage />} />
        <Route path="/event-organizer/pendaftaran" element={<KelolaPendaftaranPage />} />
        <Route path="/event-organizer/riwayat" element={<RiwayatEOPage />} />
        <Route path="/event-organizer/sertifikat" element={<SertifikatEOPage />} />
        <Route path="/event-organizer/profil" element={<ProfilePage role="EVENT_ORGANIZER" />} />

        {/* Default */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default AppRoutes
