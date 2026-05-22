import { useEffect, useState } from 'react';

export default function FormPendaftaran({ event, onClose }) {
  const kegiatanId = event?.id ?? event?.kegiatanId ?? event?.eventId;
  const [isSubmitting, setIsSubmitting] = useState(false);

  // State disesuaikan dengan field di PendaftaranRequest backend.
  const [formData, setFormData] = useState({
    kegiatanId,
    namaMahasiswa: '',
    nim: '',
    programStudi: '',
    email: '',
    nomorWhatsApp: '',
    alasan: '',
  });

  useEffect(() => {
    setFormData((prev) => ({ ...prev, kegiatanId }));
  }, [kegiatanId]);

  // Fungsi auto-fill data user dari database.
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch('http://localhost:8080/api/auth/me', {
          headers: { Authorization: `${localStorage.getItem('token')}` },
        });

        if (response.ok) {
          const data = await response.json();
          setFormData((prev) => ({
            ...prev,
            namaMahasiswa: data.nama || '',
            nim: data.nim || '',
            email: data.email || '',
            programStudi: data.prodi || '',
          }));
        }
      } catch (err) {
        console.error('Gagal auto-fill data:', err);
      }
    };

    fetchUserData();
  }, []);

  const handleInputChange = (key, value) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const parseResponse = async (response) => {
    const text = await response.text();

    if (!text) return '';

    try {
      return JSON.parse(text);
    } catch {
      return text;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.kegiatanId) {
      alert('ID kegiatan tidak ditemukan. Silakan tutup form lalu pilih kegiatan lagi.');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('http://localhost:8080/api/pendaftaran', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await parseResponse(response);

      if (response.ok) {
        alert("Pendaftaran berhasil!\nSilakan cek menu 'Pendaftaran Saya' untuk melihat status.");
        onClose();
      } else {
        alert(`Pendaftaran gagal: ${data?.message || data || 'Terjadi kesalahan server'}`);
      }
    } catch (err) {
      alert(err.message || 'Koneksi ke server gagal. Pastikan backend berjalan.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!event) return null;

  return (
    <div className="grid lg:grid-cols-2 w-full bg-white font-sans">
      <div className="p-10 border-r border-slate-100">
        <h2 className="text-2xl font-extrabold text-slate-800 mb-2">Form Pendaftaran Kegiatan</h2>
        <p className="text-slate-500 text-sm mb-8">Lengkapi data berikut untuk mendaftar kegiatan ini.</p>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <InputField label="Nama Mahasiswa" value={formData.namaMahasiswa} onChange={(e) => handleInputChange('namaMahasiswa', e.target.value)} required />
            <InputField label="NIM" value={formData.nim} onChange={(e) => handleInputChange('nim', e.target.value)} required />
          </div>
          <InputField label="Program Studi" value={formData.programStudi} onChange={(e) => handleInputChange('programStudi', e.target.value)} />
          <InputField label="Email" value={formData.email} onChange={(e) => handleInputChange('email', e.target.value)} type="email" />
          <InputField label="Nomor WhatsApp" value={formData.nomorWhatsApp} onChange={(e) => handleInputChange('nomorWhatsApp', e.target.value)} required />

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Alasan Mengikuti Kegiatan</label>
            <textarea
              className="w-full border p-3 rounded-xl h-32"
              placeholder="Tuliskan alasan singkat..."
              value={formData.alasan}
              onChange={(e) => handleInputChange('alasan', e.target.value)}
            ></textarea>
          </div>

          <div className="flex gap-4 pt-4">
            <button type="button" onClick={onClose} className="px-8 py-3 rounded-xl border font-bold text-slate-600">Batal</button>
            <button type="submit" disabled={isSubmitting} className="flex-1 px-8 py-3 rounded-xl bg-[#2B54EA] text-white font-bold disabled:cursor-not-allowed disabled:opacity-70">
              {isSubmitting ? 'Memproses...' : 'Daftar Sekarang'}
            </button>
          </div>
        </form>
      </div>

      <div className="bg-slate-50 p-10 border-l border-slate-100 flex flex-col">
        <div className="bg-white p-6 rounded-2xl border shadow-sm">
          <img src={event.image || '/default-event.jpg'} alt={event.title} className="w-full h-40 object-cover rounded-xl mb-5" />
          <h3 className="font-extrabold text-slate-800 text-lg mb-4">{event.title}</h3>
          <div className="space-y-4 text-sm text-slate-600 mb-6">
            <div className="flex items-center gap-3"><span className="text-blue-600">Tanggal</span> {event.date}</div>
            <div className="flex items-center gap-3"><span className="text-blue-600">Waktu</span> {event.time}</div>
            <div className="flex items-center gap-3"><span className="text-blue-600">Lokasi</span> {event.location}</div>
          </div>
          <div className="pt-5 border-t flex justify-between items-center font-extrabold text-blue-700">
            <span>TAK Point</span> <span className="text-lg">{event.points} Poin</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function InputField({ label, value, onChange, required = false, type = 'text' }) {
  return (
    <div>
      <label className="block text-sm font-bold text-slate-700 mb-2">{label}</label>
      <input
        className="w-full border p-3 rounded-xl text-sm"
        value={value}
        onChange={onChange}
        required={required}
        type={type}
      />
    </div>
  );
}
