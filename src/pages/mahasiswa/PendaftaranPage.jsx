import { ArrowLeft, CalendarDays, CheckCircle2, Clock3, Info, MapPin, ShieldCheck, UsersRound } from 'lucide-react'
import DashboardLayout from '../../components/layout/DashboardLayout'
import { dummyEvents } from '../../data/dummyEvents'

const selectedEvent = {
  ...dummyEvents[0],
  date: '20 Mei 2024',
  time: '09.00 - 12.00 WIB',
  location: 'Auditorium Telkom University',
  organizer: 'BEM Fakultas Informatika',
  description:
    'Seminar interaktif yang membahas perkembangan terkini di dunia teknologi informasi, kecerdasan buatan, dan masa depan industri digital di Indonesia.',
  image: 'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&w=1000&q=80',
}

function FieldLabel({ children }) {
  return <label className="text-sm font-bold text-gray-900">{children}</label>
}

function TextInput({ value, placeholder, readOnly = false }) {
  return (
    <input
      className={`mt-2 h-12 w-full rounded-xl border px-4 text-sm font-semibold outline-none transition placeholder:text-gray-400 ${
        readOnly
          ? 'border-gray-200 bg-[#EEF1FA] text-gray-500'
          : 'border-gray-200 bg-white text-gray-800 focus:border-blue-600 focus:ring-4 focus:ring-blue-600/10'
      }`}
      placeholder={placeholder}
      readOnly={readOnly}
      value={value}
    />
  )
}

function DetailRow({ icon: Icon, label, children }) {
  return (
    <div className="flex items-start gap-3">
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#F1F5FF] text-blue-600">
        <Icon className="h-5 w-5" strokeWidth={2.1} />
      </span>
      <div>
        <p className="text-xs font-bold uppercase tracking-wider text-gray-400">{label}</p>
        <p className="mt-0.5 text-sm font-semibold text-gray-900">{children}</p>
      </div>
    </div>
  )
}

function PendaftaranPage() {
  return (
    <DashboardLayout title="Form Pendaftaran">
      <div className="mx-auto max-w-6xl py-6">
        <button
          type="button"
          className="mb-5 inline-flex items-center gap-3 text-sm font-semibold text-gray-600 transition hover:text-blue-600"
        >
          <ArrowLeft className="h-5 w-5" strokeWidth={2.2} />
          <span>Detail Kegiatan</span>
        </button>

        <section className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_420px]">
          <form className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm lg:p-7">
            <div className="flex flex-col gap-4 border-b border-gray-100 pb-5 md:flex-row md:items-start md:justify-between">
              <div>
                <h2 className="text-2xl font-bold leading-tight text-gray-900">Form Pendaftaran Kegiatan</h2>
                <p className="mt-2 text-sm text-gray-500">Lengkapi data berikut untuk mendaftar kegiatan ini.</p>
              </div>

              <div className="inline-flex items-center gap-2 rounded-full bg-[#ECFDF3] px-4 py-2 text-xs font-bold text-[#14844D]">
                <ShieldCheck className="h-4 w-4" strokeWidth={2.2} />
                Data mahasiswa terverifikasi
              </div>
            </div>

            <div className="mt-6 grid gap-5 md:grid-cols-2">
              <div>
                <FieldLabel>Nama Mahasiswa</FieldLabel>
                <TextInput readOnly value="Andi Saputra" />
              </div>
              <div>
                <FieldLabel>NIM</FieldLabel>
                <TextInput readOnly value="103012430056" />
              </div>
              <div>
                <FieldLabel>Program Studi</FieldLabel>
                <select className="mt-2 h-12 w-full rounded-xl border border-gray-200 bg-white px-4 text-sm font-semibold text-gray-600 outline-none transition focus:border-blue-600 focus:ring-4 focus:ring-blue-600/10">
                  <option>Informatika</option>
                  <option>Sistem Informasi</option>
                  <option>Teknik Telekomunikasi</option>
                </select>
              </div>
              <div>
                <FieldLabel>Email</FieldLabel>
                <TextInput readOnly value="andi@student.telkomuniversity.ac.id" />
              </div>
            </div>

            <div className="mt-5 grid gap-5 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
              <div>
                <FieldLabel>Nomor WhatsApp</FieldLabel>
                <TextInput placeholder="Masukkan nomor WhatsApp aktif" />
              </div>
              <div>
                <FieldLabel>Alasan Mengikuti Kegiatan</FieldLabel>
                <textarea
                  className="mt-2 h-12 min-h-12 w-full resize-y rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-semibold text-gray-800 outline-none transition placeholder:text-gray-400 focus:border-blue-600 focus:ring-4 focus:ring-blue-600/10 lg:min-h-[120px]"
                  placeholder="Tuliskan alasan singkat kamu mengikuti kegiatan ini..."
                />
              </div>
            </div>

            <div className="mt-6 rounded-2xl border border-[#BFD2FF] bg-[#F4F7FF] p-4">
              <div className="flex gap-3">
                <Info className="mt-0.5 h-5 w-5 shrink-0 text-blue-600" strokeWidth={2.2} />
                <div>
                  <p className="text-sm font-bold text-blue-700">Informasi Pendaftaran</p>
                  <p className="mt-1 text-sm leading-relaxed text-gray-600">
                    Setelah mendaftar, status pendaftaran dapat dilihat pada menu Pendaftaran Saya.
                  </p>
                </div>
              </div>
            </div>

            <label className="mt-6 flex items-center gap-3 text-sm font-semibold text-gray-700">
              <input
                type="checkbox"
                className="h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-600"
              />
              <span>Saya memastikan data yang diisi sudah benar.</span>
            </label>

            <div className="mt-7 flex flex-col-reverse gap-3 border-t border-gray-100 pt-5 sm:flex-row sm:justify-end">
              <button
                type="button"
                className="h-12 rounded-xl border border-gray-200 bg-white px-8 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
              >
                Batal
              </button>
              <button
                type="submit"
                className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-blue-600 px-8 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"
              >
                <CheckCircle2 className="h-5 w-5" strokeWidth={2.2} />
                Daftar Sekarang
              </button>
            </div>
          </form>

          <aside className="xl:sticky xl:top-24 xl:self-start">
            <article className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
              <div className="relative h-56 overflow-hidden">
                <img className="h-full w-full object-cover" src={selectedEvent.image} alt={selectedEvent.title} />
                <span className="absolute left-5 top-5 rounded-full bg-blue-600 px-4 py-2 text-xs font-bold text-white shadow-lg shadow-blue-600/20">
                  Wajib
                </span>
              </div>

              <div className="p-6">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="text-2xl font-bold leading-tight text-gray-900">{selectedEvent.title}</h3>
                    <span className="mt-3 inline-flex rounded-full bg-[#EEF2FF] px-3 py-1 text-xs font-bold text-blue-700">
                      {selectedEvent.category}
                    </span>
                  </div>
                  <div className="shrink-0 rounded-2xl bg-blue-50 px-4 py-3 text-right">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-gray-500">TAK Point</p>
                    <p className="mt-1 text-xl font-bold text-blue-600">{selectedEvent.points}</p>
                  </div>
                </div>

                <p className="mt-4 text-sm leading-relaxed text-gray-600">{selectedEvent.description}</p>

                <div className="mt-5 grid gap-4">
                  <DetailRow icon={CalendarDays} label="Tanggal">{selectedEvent.date}</DetailRow>
                  <DetailRow icon={Clock3} label="Waktu">{selectedEvent.time}</DetailRow>
                  <DetailRow icon={MapPin} label="Lokasi">{selectedEvent.location}</DetailRow>
                  <DetailRow icon={UsersRound} label="Penyelenggara">{selectedEvent.organizer}</DetailRow>
                </div>
              </div>
            </article>
          </aside>
        </section>
      </div>
    </DashboardLayout>
  )
}

export default PendaftaranPage
