import { ArrowLeft, Calendar, Clock, MapPin, Bookmark, Star, ArrowRight } from 'lucide-react';

export default function DetailKegiatan({ event, onDaftar, onClose }) {
  return (
    <div className="w-full p-8 font-sans bg-[#F8F9FA]">
      {/* Tombol Back */}
      <button onClick={onClose} className="flex items-center gap-2 text-slate-600 hover:text-slate-900 font-bold mb-6">
        <ArrowLeft size={20} /> List kegiatan
      </button>

      {/* Grid Utama */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Kolom Kiri: Deskripsi & Info (2/3) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Card Atas */}
          <div className="bg-white rounded-2xl border border-slate-200 p-8">
            <h1 className="text-3xl font-extrabold text-[#171B29] mb-4">{event.title}</h1>
            <div className="flex gap-4 text-sm text-[#6C7A93] mb-6">
              <div className="flex items-center gap-2"><Calendar size={16}/> {event.date}</div>
              <div className="flex items-center gap-2"><Clock size={16}/> {event.time}</div>
              <div className="flex items-center gap-2"><MapPin size={16}/> {event.location}</div>
            </div>
            <h3 className="font-extrabold text-[#171B29] mb-2">Deskripsi Kegiatan</h3>
            <p className="text-[#6C7A93] text-sm leading-relaxed">
              Seminar Nasional Teknologi 2024 adalah wadah bagi mahasiswa untuk memahami tren teknologi terkini yang sedang berkembang pesat di industri... (isi dengan deskripsi kegiatan)
            </p>
          </div>

          {/* Card Informasi Detail */}
          <div className="bg-white rounded-2xl border border-slate-200 p-8">
            <h3 className="text-lg font-extrabold text-[#171B29] mb-6">Informasi Detail</h3>
            <div className="grid grid-cols-2 gap-y-6">
              <div><p className="text-xs font-semibold text-[#6C7A93]">Kategori</p><p className="font-bold text-sm">{event.category}</p></div>
              <div><p className="text-xs font-semibold text-[#6C7A93]">Batas Pendaftaran</p><p className="font-bold text-sm">{event.date}</p></div>
              <div><p className="text-xs font-semibold text-[#6C7A93]">Penyelenggara</p><p className="font-bold text-sm">BEM Kema Telkom University</p></div>
              <div><p className="text-xs font-semibold text-[#6C7A93]">Link Pendaftaran</p><p className="font-bold text-sm text-[#2B54EA]">0812-3456-7890 (Andi)</p></div>
            </div>
          </div>
        </div>

        {/* Kolom Kanan: Aksi (1/3) */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 sticky top-6">
            <h3 className="text-lg font-extrabold text-[#171B29] mb-4">Aksi Kegiatan</h3>
            <div className="flex justify-between items-center text-sm pb-4 mb-5 border-b">
              <span className="text-[#6C7A93]">Tutup Pada</span>
              <span className="font-bold text-[#171B29]">{event.date}</span>
            </div>
            <button onClick={onDaftar} className="w-full bg-[#2B54EA] text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-[#1a40c4]">
              Daftar Sekarang <ArrowRight size={16}/>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}