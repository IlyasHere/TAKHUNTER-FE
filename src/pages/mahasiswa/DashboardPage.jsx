import { useState } from 'react';
import { Star } from 'lucide-react';
import EventCard from '../../components/cards/EventCard';
import LatestEventCard from '../../components/cards/LatestEventCard';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Card from '../../components/ui/Card';
import Modal from '../../components/ui/Modal';
import { dummyEvents } from '../../data/dummyEvents';
import DetailKegiatan from './KegiatanPage'; 
import FormPendaftaran from './FormPendaftaran'; // TAMBAHKAN BARIS INI


function DashboardPage() {
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [modalType, setModalType] = useState(null); 
  const [activeFilter, setActiveFilter] = useState('Seminar');

  const categories = ['Seminar', 'Workshop', 'Kompetisi', 'Bootcamp'];

  const handleOpenDetail = (event) => {
    setSelectedEvent(event);
    setModalType('detail');
  };

  return (
    <DashboardLayout title="Dashboard Mahasiswa">
      <section className="grid gap-6 xl:grid-cols-[360px_1fr]">
        
        {/* Kiri: Profil, Poin, & Filter Chips */}
        <Card className="border-[#D9DEEE] p-6 shadow-none flex flex-col gap-5">
          <div>
            <h2 className="text-[22px] font-extrabold text-[#171B29]">Halo, Ilyas</h2>
            <p className="text-sm text-[#6C7A93] mt-1">Selamat datang kembali di TAK App.</p>
          </div>

          {/* Kotak Total Poin TAK */}
          <div className="bg-[#2B54EA] text-white p-4 rounded-2xl flex items-center justify-between shadow-sm relative overflow-hidden">
            <div>
              <p className="text-xs text-blue-100 font-medium">Total Poin TAK</p>
              <p className="text-2xl font-extrabold mt-1">
                120 <span className="text-lg font-normal text-blue-100">Poin</span>
              </p>
            </div>
            {/* Lingkaran Bintang */}
            <div className="bg-[#FFC107] p-2.5 rounded-full flex items-center justify-center shadow-md">
              <Star className="w-5 h-5 text-white fill-white" />
            </div>
          </div>

          {/* Filter Chips Kategori */}
          <div className="flex flex-wrap gap-2 pt-1">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveFilter(category)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all border ${
                  activeFilter === category
                    ? 'bg-[#2B54EA] border-[#2B54EA] text-white shadow-sm'
                    : 'bg-white border-[#D9DEEE] text-[#6C7A93] hover:bg-gray-50'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </Card>

        {/* Kanan: Kegiatan Terbaru */}
        <Card className="border-[#D9DEEE] p-6 shadow-none">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-[18px] font-extrabold text-[#171B29]">Kegiatan Terbaru</h2>
            <button className="text-sm font-bold text-[#2B54EA] hover:underline transition-all">
              Lihat semua
            </button>
          </div>
          <div className="grid gap-6 md:grid-cols-2">
            {dummyEvents.slice(0, 2).map((event) => (
              <LatestEventCard key={event.id} event={event} onClick={() => handleOpenDetail(event)} />
            ))}
          </div>
        </Card>
      </section>

      {/* Konten Bawah: Kegiatan Tersedia */}
      <section className="mt-10">
        <h2 className="mb-6 text-[22px] font-extrabold text-[#171B29]">Kegiatan Tersedia</h2>
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {dummyEvents.map((event) => (
            <EventCard key={event.id} event={event} onClick={() => handleOpenDetail(event)} />
          ))}
        </div>
      </section>

      {/* Modal Overlay dengan dynamic maxWidth */}
// Di dalam DashboardPage.jsx, update bagian Modal
      <Modal 
        isOpen={!!selectedEvent} 
        onClose={() => {
          setSelectedEvent(null);
          setModalType(null); // Reset saat modal ditutup
        }}
        maxWidth={modalType === 'form' ? "max-w-2xl" : "max-w-6xl"} // Ubah ukuran sesuai konten
      >
        {selectedEvent && (
          <>
            {modalType === 'detail' && (
              <DetailKegiatan 
                event={selectedEvent} 
                onDaftar={() => setModalType('form')} // Pindah ke form saat klik Daftar
                onClose={() => setSelectedEvent(null)}
              />
            )}
            
            {modalType === 'form' && (
              <FormPendaftaran 
                event={selectedEvent} 
                onClose={() => setSelectedEvent(null)}
                onBack={() => setModalType('detail')} // Opsional: Kembali ke detail
              />
            )}
          </>
        )}
      </Modal>
    </DashboardLayout>
  );
}

export default DashboardPage;