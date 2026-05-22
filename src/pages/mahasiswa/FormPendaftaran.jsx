import { useState, useEffect } from 'react';
import { buildApiUrl } from '../../lib/api';

const getBearerToken = () => {
  const token = (localStorage.getItem('token') || localStorage.getItem('accessToken') || '').trim().replace(/^"|"$/g, '');

  if (!token) return '';
  return token.startsWith('Bearer ') ? token : `Bearer ${token}`;
};

export default function FormPendaftaran({ event, onClose, onSuccess }) {
  // State disesuaikan dengan field di Pendaftaran.java
  const [formData, setFormData] = useState({
      eventId: event?.id || '',
      namaMahasiswa: '',
      nim: '',
      programStudi: '',
      email: '',
      nomorWhatsApp: '',
      alasan: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Fungsi auto-fill data user dari database.
  useEffect(() => {
    const fetchUserData = async () => {
      const token = getBearerToken();

      try {
        const response = await fetch(buildApiUrl('/api/auth/me'), {
          headers: { Authorization: token }
        });

        if (response.ok) {
          const data = await response.json();
          setFormData((prev) => ({
            ...prev,
            namaMahasiswa: data.nama || data.name || '',
            nim: data.nim || '',
            email: data.email || '',
            programStudi: data.prodi || data.programStudi || data.program_studi || ''
          }));
        }
      } catch (err) {
        console.error('Gagal auto-fill data:', err);
      }
    };

    fetchUserData();
  }, [event?.id]);

  if (!event) return null;

  const handleInputChange = (key, value) => {
    setFormData(prev => ({ ...prev, [key]: value }));
    setErrorMessage('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const kegiatanId = Number(event.id || formData.eventId);
    const payload = {
      ...formData,
      eventId: kegiatanId,
      kegiatanId,
    };

    if (!payload.eventId || Number.isNaN(payload.eventId)) {
      setErrorMessage('ID kegiatan tidak valid. Tutup form lalu pilih kegiatan kembali.');
      return;
    }

    if (!payload.namaMahasiswa.trim() || !payload.nim.trim() || !payload.programStudi.trim() || !payload.email.trim() || !payload.nomorWhatsApp.trim()) {
      setErrorMessage('Nama, NIM, program studi, email, dan nomor WhatsApp wajib diisi.');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage('');

    try {
        const response = await fetch(buildApiUrl('/api/pendaftaran'), {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: getBearerToken(),
            },
            body: JSON.stringify(payload)
        });

        const rawData = await response.text();
        let data = null;

        try {
          data = rawData ? JSON.parse(rawData) : null;
        } catch {
          data = rawData;
        }

        if (response.ok) {
            onSuccess?.();
        } else {
            // Notifikasi Gagal dari Backend
            const message = data?.message || data?.error || (typeof data === 'string' ? data : '') || "Terjadi kesalahan server";
            setErrorMessage(message);
        }
    } catch {
        setErrorMessage("Koneksi ke server gagal. Pastikan backend berjalan.");
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
          {errorMessage ? (
            <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-600">
              {errorMessage}
            </p>
          ) : null}

          <div className="grid grid-cols-2 gap-4">
            <InputField label="Nama Mahasiswa" value={formData.namaMahasiswa} onChange={(e) => handleInputChange('namaMahasiswa', e.target.value)} required />
            <InputField label="NIM" value={formData.nim} onChange={(e) => handleInputChange('nim', e.target.value)} required />
          </div>
          <InputField label="Program Studi" value={formData.programStudi} onChange={(e) => handleInputChange('programStudi', e.target.value)} />
          <InputField label="Email" value={formData.email} onChange={(e) => handleInputChange('email', e.target.value)} />
          <InputField label="Nomor WhatsApp" value={formData.nomorWhatsApp} onChange={(e) => handleInputChange('nomorWhatsApp', e.target.value)} />
          
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
