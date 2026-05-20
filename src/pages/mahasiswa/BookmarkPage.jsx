import DashboardLayout from '../../components/layout/DashboardLayout';
import { Bookmark, Calendar, MapPin, Trash2 } from 'lucide-react';
import GambarBm1 from '../../assets/images/bm1.png';

function BookmarkPage() {
  // Data dummy (nanti diganti data asli dari API Spring Boot)
  const savedActivities = [
    {
      id: 1,
      title: "Workshop Desain UI/UX: Mobile First",
      type: "OPSIONAL",
      date: "02 Nov 2024 • 13:00 WIB",
      location: "Lab Komputer 3",
      points: 10,
      image: GambarBm1, 
    },
    {
      id: 2,
      title: "Workshop Desain UI/UX: Mobile First",
      type: "OPSIONAL",
      date: "02 Nov 2024 • 13:00 WIB",
      location: "Lab Komputer 3",
      points: 10,
      image: GambarBm1, 
    }
  ];

  return (
    <DashboardLayout title="Bookmark Mahasiswa">
      <div className="max-w-6xl mx-auto py-6">
        
        {/* Bagian Header & Card Total */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Kegiatan Tersimpan</h1>
            <p className="text-sm text-gray-500 mt-1">
              Daftar kegiatan yang kamu simpan untuk dilihat kembali nanti
            </p>
          </div>

          {/* Card Total Bookmark */}
          <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
            <div className="bg-blue-100 p-3 rounded-full text-blue-600 flex items-center justify-center">
              <Bookmark size={24} fill="currentColor" />
            </div>
            <div className="pr-4">
              <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider mb-0.5">Total Bookmark</p>
              <p className="text-xl font-bold text-gray-900">8 Kegiatan</p>
            </div>
          </div>
        </div>

        {/* Grid Card Kegiatan */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {savedActivities.map((activity) => (
            <div key={activity.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col">
              
              {/* Bagian Gambar & Badge */}
              <div className="relative h-48 bg-gray-100">
                <img 
                  src={activity.image} // === LANGKAH C: INI AKAN MEMANGGIL GambarBm1 ===
                  alt={activity.title} 
                  className="w-full h-full object-cover" // Memastikan gambar tidak gepeng
                />
                <span className="absolute top-4 left-4 bg-white px-3 py-1 text-[10px] font-bold rounded-full text-gray-700 tracking-wider">
                  {activity.type}
                </span>
                <button className="absolute top-4 right-4 text-white bg-blue-600 p-2 rounded-full hover:bg-blue-700 transition">
                  <Bookmark size={18} fill="currentColor" />
                </button>
              </div>

              {/* Bagian Konten Card */}
              <div className="p-5 flex-1 flex flex-col">
                <h3 className="font-bold text-lg mb-4 text-gray-900 leading-snug">
                  {activity.title}
                </h3>
                
                <div className="text-sm text-gray-500 space-y-2 mb-5">
                  <div className="flex items-center gap-2">
                    <Calendar size={16} /> 
                    <span>{activity.date}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin size={16} /> 
                    <span>{activity.location}</span>
                  </div>
                </div>

                <div className="flex justify-between items-center border-t border-gray-100 pt-4 mb-5">
                  <span className="text-xs text-gray-500 font-medium">Poin TAK</span>
                  <span className="font-bold text-blue-600 text-base">{activity.points} Poin</span>
                </div>

                {/* Tombol Aksi */}
                <div className="flex gap-3 mt-auto">
                  <button className="flex-1 bg-blue-600 text-white py-2.5 rounded-xl text-sm font-semibold hover:bg-blue-700 transition">
                    Lihat Detail
                  </button>
                  <button className="flex-1 bg-white border border-gray-200 text-gray-700 py-2.5 rounded-xl text-sm font-semibold flex justify-center items-center gap-2 hover:bg-gray-50 transition">
                    <Trash2 size={16} /> Hapus
                  </button>
                </div>
              </div>
              
            </div>
          ))}
        </div>

      </div>
    </DashboardLayout>
  );
}

export default BookmarkPage;
