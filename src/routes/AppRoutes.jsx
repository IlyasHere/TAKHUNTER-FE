import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import LoginPage from '../pages/auth/LoginPage'
import RegisterPage from '../pages/auth/RegisterPage'
import BookmarkPage from '../pages/mahasiswa/BookmarkPage'
import DashboardPage from '../pages/mahasiswa/DashboardPage'
import RiwayatPage from '../pages/mahasiswa/RiwayatPage'
import SertifikatPage from '../pages/mahasiswa/SertifikatPage'
import KegiatanPage from '../pages/mahasiswa/KegiatanPage' // Tambahkan ini

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        
        {/* Rute Kegiatan */}
        <Route path="/kegiatan" element={<DashboardPage />} /> 
        <Route path="/kegiatan/:id" element={<KegiatanPage />} /> {/* Rute Dinamis Detail */}
        
        <Route path="/bookmark" element={<BookmarkPage />} />
        <Route path="/riwayat" element={<RiwayatPage />} />
        <Route path="/sertifikat" element={<SertifikatPage />} />
        
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default AppRoutes