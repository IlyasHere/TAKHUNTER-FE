import { CalendarDays, ChevronLeft, ChevronRight, Eye, ImageIcon, ListFilter, Pencil, Trash2 } from 'lucide-react'

const events = [
  {
    id: 1,
    name: 'Seminar Nasional AI 2024',
    points: '5 TAK Points',
    category: 'Seminar',
    date: '24 Okt 2023',
    registrants: 124,
    status: 'Aktif',
    statusClass: 'bg-[#DFF7E8] text-[#159447]',
    dotClass: 'bg-[#16B354]',
    thumbnail: 'image',
  },
  {
    id: 2,
    name: 'Workshop Advanced UI/UX',
    points: '8 TAK Points',
    category: 'Workshop',
    date: '28 Okt 2023',
    registrants: 45,
    status: 'Draft',
    statusClass: 'bg-[#E0E3E6] text-[#555B68]',
    dotClass: 'bg-[#7B8190]',
    thumbnail: 'blank',
  },
  {
    id: 3,
    name: 'Lomba Karya Tulis Ilmiah',
    points: '10 TAK Points',
    category: 'Lomba',
    date: '15 Nov 2023',
    registrants: 32,
    status: 'Selesai',
    statusClass: 'bg-[#DCEAFF] text-[#1459D8]',
    dotClass: 'bg-[#1D64F2]',
    thumbnail: 'placeholder',
  },
]

function EOEventsTable() {
  return (
    <section className="overflow-hidden rounded-lg border border-[#C8CEE0] bg-white shadow-sm">
      <div className="flex flex-col gap-4 px-6 py-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-col gap-4 sm:flex-row">
          <button className="flex h-10 w-full items-center justify-between rounded border border-[#C8CEE0] bg-white px-3 text-sm font-medium text-[#222835] sm:w-[256px]" type="button">
            <span className="flex items-center gap-3">
              <ListFilter className="h-4 w-4 text-[#606779]" />
              Semua Kategori
            </span>
            <ChevronRight className="h-4 w-4 rotate-90 text-[#606779]" />
          </button>
          <button className="flex h-10 w-full items-center justify-between rounded border border-[#C8CEE0] bg-white px-3 text-sm font-medium text-[#222835] sm:w-[256px]" type="button">
            <span className="flex items-center gap-3">
              <CalendarDays className="h-4 w-4 text-[#606779]" />
              Urutkan Tanggal
            </span>
            <ChevronRight className="h-4 w-4 rotate-90 text-[#606779]" />
          </button>
        </div>
        <p className="text-xs font-bold text-[#4E5363]">Menampilkan 8 dari 12 kegiatan</p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[900px] border-collapse">
          <thead>
            <tr className="h-16 bg-[#0D329D] text-left text-[17px] font-extrabold uppercase tracking-wide text-white">
              <th className="px-8">Nama Kegiatan</th>
              <th className="px-4">Kategori</th>
              <th className="px-4">Tanggal</th>
              <th className="px-4">Pendaftar</th>
              <th className="px-4">Status</th>
              <th className="px-8 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {events.map((event, index) => (
              <tr key={event.id} className={`border-b border-[#D5DAE8] ${index === 1 ? 'bg-[#F1F2F4]' : 'bg-white'}`}>
                <td className="px-8 py-7">
                  <div className="flex items-center gap-6">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center bg-[#F6F7FA] text-[#8A90A0]">
                      {event.thumbnail === 'placeholder' ? (
                        <div className="flex h-full w-full items-center justify-center bg-[#D8DBE0]">
                          <ImageIcon className="h-5 w-5" />
                        </div>
                      ) : event.thumbnail === 'image' ? (
                        <div className="h-full w-full bg-[linear-gradient(135deg,#EEF4FF_25%,#FFFFFF_25%,#FFFFFF_50%,#EEF4FF_50%,#EEF4FF_75%,#FFFFFF_75%)] bg-[length:12px_12px]" />
                      ) : null}
                    </div>
                    <div>
                      <p className="max-w-[150px] text-[17px] font-extrabold leading-tight text-[#171B29]">{event.name}</p>
                      <p className="mt-1 text-xs font-extrabold text-[#0D329D]">{event.points}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-7">
                  <span className="rounded-full bg-[#DCEAFF] px-3 py-1 text-xs font-extrabold text-[#174EAA]">{event.category}</span>
                </td>
                <td className="px-4 py-7 text-[16px] font-medium text-[#3F4555]">{event.date}</td>
                <td className="px-4 py-7">
                  <p className="text-[17px] font-extrabold text-[#171B29]">{event.registrants}</p>
                  <p className="mt-1 text-[11px] font-bold text-[#B7BDCC]">Mahasiswa</p>
                </td>
                <td className="px-4 py-7">
                  <span className={`inline-flex items-center gap-1.5 rounded px-2 py-1 text-xs font-extrabold ${event.statusClass}`}>
                    <span className={`h-1.5 w-1.5 rounded-full ${event.dotClass}`} />
                    {event.status}
                  </span>
                </td>
                <td className="px-8 py-7">
                  <div className="flex items-center justify-end gap-5">
                    <button className="text-[#0D329D]" type="button" aria-label="Edit kegiatan">
                      <Pencil className="h-5 w-5" strokeWidth={2.3} />
                    </button>
                    <button className="text-[#3E4554]" type="button" aria-label="Lihat kegiatan">
                      <Eye className="h-5 w-5" strokeWidth={2.3} />
                    </button>
                    <button className="text-[#DC1717]" type="button" aria-label="Hapus kegiatan">
                      <Trash2 className="h-5 w-5" strokeWidth={2.3} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between px-6 py-6">
        <p className="text-xs font-semibold text-[#3E4554]">Halaman 1 dari 3</p>
        <div className="flex items-center gap-2">
          <button className="flex h-9 w-7 items-center justify-center rounded border border-[#E2E5EF] text-[#C8CEDB]" type="button">
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button className="h-11 w-8 rounded bg-[#0D329D] text-sm font-extrabold text-white" type="button">1</button>
          <button className="h-11 w-8 rounded text-sm font-medium text-[#171B29]" type="button">2</button>
          <button className="h-11 w-8 rounded text-sm font-medium text-[#171B29]" type="button">3</button>
          <button className="flex h-9 w-7 items-center justify-center rounded border border-[#C8CEE0] text-[#171B29]" type="button">
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>
    </section>
  )
}

export default EOEventsTable
