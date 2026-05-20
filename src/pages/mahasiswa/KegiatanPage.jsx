// src/pages/mahasiswa/KegiatanPage.jsx
import { ArrowLeft, Calendar, Clock, MapPin, Bookmark, Star, ArrowRight } from 'lucide-react';

export default function DetailKegiatan({ event, onDaftar, onClose }) {
  if (!event) return null;

  return (
    <div className="w-full min-h-full p-4 md:p-6 lg:p-8 font-sans bg-[#F8F9FA]">
      {/* Header / Tombol Back */}
      <button 
        onClick={onClose}
        className="flex items-center gap-2 text-slate-600 hover:text-slate-900 font-medium mb-6 transition-colors"
      >
        <ArrowLeft size={20} />
        List kegiatan
      </button>

      {/* Kontainer Utama */}
      <div className="flex flex-col gap-6 w-full mx-auto">
        
        {/* CARD 1: Header & Banner Image */}
        <div className="bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-sm">
          {/* Banner Image */}
          <div className="h-56 md:h-72 w-full relative bg-slate-100">
            <img 
              src={event.image || event.thumb} 
              alt={event.title} 
              className="w-full h-full object-cover"
            />
            {/* Badges Overlay */}
            <div className="absolute top-6 left-6 flex gap-2">
              <span className="bg-white text-slate-700 px-3 py-1.5 rounded-md text-xs font-bold uppercase tracking-wide shadow-sm">
                {event.category || 'SEMINAR'}
              </span>
              <span className={`px-3 py-1.5 rounded-md text-xs font-bold uppercase tracking-wide shadow-sm ${
                event.type === 'WAJIB' ? 'bg-white text-slate-800' : 'bg-slate-800 text-white'
              }`}>
                {event.type || 'WAJIB'}
              </span>
            </div>
          </div>

          {/* Info Header Teks */}
          <div className="p-6 md:p-8 flex flex-col lg:flex-row justify-between items-start gap-6">
            <div className="flex-1">
              <h1 className="text-2xl md:text-3xl font-bold text-slate-800 mb-3">
                {event.title}
              </h1>
              <p className="text-slate-600 mb-5 max-w-2xl leading-relaxed">
                Kegiatan seminar nasional yang membahas perkembangan teknologi digital, inovasi, dan peluang mahasiswa di era transformasi digital.
              </p>
              
              <div className="flex flex-wrap items-center gap-6 text-sm text-slate-500 font-medium">
                <div className="flex items-center gap-2">
                  <Calendar size={18} />
                  <span>{event.date || '20 Mei 2024'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock size={18} />
                  <span>{event.time || '08.00 - 16.00 WIB'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin size={18} />
                  <span>{event.location || 'Aula Gedung D, Telkom University'}</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-4 w-full lg:w-auto min-w-[220px]">
              <div className="bg-[#EEF2FF] text-[#4F46E5] px-4 py-4 rounded-xl flex items-center gap-3 font-semibold border border-[#E0E7FF]">
                <div className="bg-white rounded-full p-1 shadow-sm">
                  <Star size={16} className="fill-[#4F46E5] text-[#4F46E5]" />
                </div>
                Poin TAK: {event.points || 20} Poin
              </div>
              <div className="flex gap-3">
                <button 
                  onClick={onDaftar}
                  className="flex-1 bg-[#4F46E5] hover:bg-[#4338CA] text-white py-3 px-4 rounded-xl font-semibold transition-colors shadow-sm"
                >
                  Daftar Kegiatan
                </button>
                <button className="p-3 border border-slate-300 text-slate-600 rounded-xl hover:bg-slate-50 transition-colors bg-white">
                  <Bookmark size={20} />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* CARD 2 & 3: Layout Bawah (Grid Kolom) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Kolom Kiri (Deskripsi & Informasi Detail) */}
          <div className="col-span-1 lg:col-span-2 flex flex-col gap-6">
            
            {/* Box Deskripsi */}
            <div className="bg-white rounded-2xl p-6 md:p-8 border border-slate-200 shadow-sm">
              <h2 className="text-xl font-bold text-slate-800 mb-4">Deskripsi Kegiatan</h2>
              <div className="text-slate-600 space-y-4 text-sm md:text-base leading-relaxed">
                <p>
                  Seminar Nasional Teknologi 2024 adalah wadah bagi mahasiswa untuk memahami tren teknologi terkini yang sedang berkembang pesat di industri. Acara ini akan menghadirkan para ahli dan praktisi terkemuka di bidang teknologi informasi, kecerdasan buatan, dan transformasi digital perusahaan.
                </p>
                <p>
                  Peserta akan mendapatkan wawasan mendalam mengenai bagaimana mempersiapkan diri menghadapi tantangan karier di masa depan, serta peluang inovasi yang dapat diciptakan oleh generasi muda. Kegiatan ini bersifat wajib bagi mahasiswa tingkat akhir Fakultas Informatika sebagai bagian dari pemenuhan syarat kelulusan.
                </p>
              </div>
            </div>

            {/* Box Informasi Detail */}
            <div className="bg-white rounded-2xl p-6 md:p-8 border border-slate-200 shadow-sm">
              <h2 className="text-xl font-bold text-slate-800 mb-6">Informasi Detail</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-6 gap-x-4">
                <div>
                  <p className="text-xs text-slate-500 font-medium mb-1">Kategori</p>
                  <p className="font-semibold text-slate-800">{event.category || 'Seminar'} Nasional</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 font-medium mb-1">Batas Pendaftaran</p>
                  <p className="font-semibold text-slate-800">18 Mei 2024, 23:59 WIB</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 font-medium mb-1">Penyelenggara</p>
                  <p className="font-semibold text-slate-800">BEM Kema Telkom University</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 font-medium mb-1">Link pendaftaran</p>
                  <a href="#" className="font-semibold text-[#4F46E5] hover:underline">0812-3456-7890 (Andi)</a>
                </div>
              </div>
            </div>

          </div>

          {/* Kolom Kanan (Aksi Kegiatan) */}
          <div className="col-span-1">
            <div className="bg-white rounded-2xl p-6 md:p-8 border border-slate-200 shadow-sm sticky top-6">
              <h2 className="text-xl font-bold text-slate-800 mb-6">Aksi Kegiatan</h2>
              
              <div className="flex justify-between items-center mb-6 pb-6 border-b border-slate-100">
                <span className="text-sm text-slate-500">Tutup Pada</span>
                <span className="text-sm font-bold text-slate-800">18 Mei 2024</span>
              </div>

              <button 
                onClick={onDaftar} // Ini akan memicu setModalType('form') dari DashboardPage
                className="w-full flex items-center justify-center gap-2 bg-[#4F46E5] hover:bg-[#4338CA] text-white py-3.5 rounded-xl font-semibold transition-colors shadow-sm"
              >
                Daftar Sekarang
                <ArrowRight size={18} />
              </button>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}