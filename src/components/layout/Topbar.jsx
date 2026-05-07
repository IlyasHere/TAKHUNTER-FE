import { Menu, Search, UserRound } from 'lucide-react'

function Topbar({ title = 'Dashboard Mahasiswa', onMenuClick }) {
  return (
    <header className="sticky top-0 z-20 flex h-[72px] items-center justify-between border-b border-[#DDE1EF] bg-white px-5 lg:px-8">
      <div className="flex min-w-0 items-center gap-3">
        <button
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[#CED3E5] bg-[#F8F8FF] text-[#161A27] transition hover:bg-[#EEF1FA] lg:hidden"
          type="button"
          onClick={onMenuClick}
          aria-label="Buka menu"
        >
          <Menu className="h-5 w-5" strokeWidth={2.2} />
        </button>
        <h1 className="truncate text-[18px] font-extrabold text-[#161A27] sm:text-[20px]">{title}</h1>
      </div>

      <div className="flex items-center gap-4">
        <div className="hidden h-10 w-[258px] items-center rounded-xl border border-[#CED3E5] bg-[#F8F8FF] px-3 md:flex">
          <Search className="h-[19px] w-[19px] text-[#6F7485]" />
          <input
            type="text"
            placeholder="Cari kegiatan..."
            className="h-full flex-1 bg-transparent px-3 text-sm font-medium text-[#202433] outline-none placeholder:text-[#777B8F]"
          />
        </div>
        <button className="flex h-10 w-10 items-center justify-center rounded-full border border-[#CED3E5] bg-[#EEF1FA] text-[#161A27]" type="button">
          <UserRound className="h-5 w-5" strokeWidth={2.1} />
        </button>
      </div>
    </header>
  )
}

export default Topbar
