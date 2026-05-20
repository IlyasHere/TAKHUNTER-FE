function EOStatCard({ label, value, icon: Icon, tone = 'blue' }) {
  const tones = {
    blue: 'bg-[#EAF1FF] text-[#0A57C8] shadow-[inset_0_0_0_1px_rgba(10,87,200,0.08)]',
    indigo: 'bg-[#EEF2FF] text-[#0D329D] shadow-[inset_0_0_0_1px_rgba(13,50,157,0.08)]',
    gray: 'bg-[#F0F2F5] text-[#4D5160] shadow-[inset_0_0_0_1px_rgba(77,81,96,0.08)]',
  }

  return (
    <div className="group relative flex h-[147px] overflow-hidden rounded-2xl border border-[#D6DCEE] bg-white px-8 py-7 shadow-[0_10px_28px_rgba(20,36,82,0.05)] transition duration-200 hover:-translate-y-1 hover:border-[#B8C5E6] hover:shadow-[0_20px_44px_rgba(13,50,157,0.12)]">
      <div className="absolute inset-x-0 top-0 h-1 bg-[#0D329D] opacity-0 transition group-hover:opacity-100" />
      <div>
        <p className="text-sm font-extrabold text-[#4E5363]">{label}</p>
        <p className="mt-2 text-[48px] font-extrabold leading-none text-[#0D329D]">{value}</p>
      </div>
      <div className={`ml-auto flex h-16 w-16 items-center justify-center rounded-2xl transition duration-200 group-hover:scale-105 ${tones[tone]}`}>
        <Icon className="h-7 w-7" strokeWidth={2.3} />
      </div>
    </div>
  )
}

export default EOStatCard
