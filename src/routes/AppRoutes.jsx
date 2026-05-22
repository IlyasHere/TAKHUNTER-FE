import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import LoginPage from '../pages/auth/LoginPage'
import RegisterPage from '../pages/auth/RegisterPage'
import AddKegiatanPage from '../pages/event-organizer/AddKegiatanPage'
import DashboardEOPage from '../pages/event-organizer/DashboardEOPage'
import DetailKegiatanPage from '../pages/event-organizer/DetailKegiatanPage'
import EditKegiatanPage from '../pages/event-organizer/EditKegiatanPage'
import BookmarkPage from '../pages/mahasiswa/BookmarkPage'
import DashboardPage from '../pages/mahasiswa/DashboardPage'
import RiwayatPage from '../pages/mahasiswa/RiwayatPage'
import SertifikatPage from '../pages/mahasiswa/SertifikatPage'

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/kegiatan" element={<DashboardPage />} />
        <Route path="/event-organizer/dashboard" element={<DashboardEOPage />} />
        <Route path="/event-organizer/kegiatan" element={<DashboardEOPage />} />
        <Route path="/event-organizer/kegiatan/tambah" element={<AddKegiatanPage />} />
        <Route path="/event-organizer/kegiatan/:id" element={<DetailKegiatanPage />} />
        <Route path="/event-organizer/kegiatan/:id/edit" element={<EditKegiatanPage />} />
        <Route path="/event-organizer/pendaftaran" element={<DashboardEOPage />} />
        <Route path="/event-organizer/riwayat" element={<DashboardEOPage />} />
        <Route path="/event-organizer/sertifikat" element={<DashboardEOPage />} />
        <Route path="/bookmark" element={<BookmarkPage />} />
        <Route path="/riwayat" element={<RiwayatPage />} />
        <Route path="/sertifikat" element={<SertifikatPage />} />
        
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default AppRoutes
