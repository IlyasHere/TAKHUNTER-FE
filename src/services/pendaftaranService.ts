// Definisikan tipe data untuk formData
export interface PendaftaranData {
  eventId: number;
  namaMahasiswa: string;
  nim: string;
  programStudi: string;
  email: string;
  noWhatsapp: string;
  alasan: string;
}

const API_URL = 'http://localhost:8080/api/pendaftaran';

// Tambahkan : PendaftaranData setelah formData
export const submitPendaftaranForm = async (formData: PendaftaranData) => {
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Gagal melakukan pendaftaran');
    }

    return data;
  } catch (error) {
    throw error;
  }
};