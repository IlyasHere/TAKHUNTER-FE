function EOStatCard({ label, value, icon: Icon, tone = 'blue' }) {
  const tones = {
    blue: 'bg-[#DDE5FF] text-[#0A57C8]',
    indigo: 'bg-[#DDE1FF] text-[#0D329D]',
    gray: 'bg-[#E5E7EA] text-[#4D5160]',
  }

  return (
    <div className="flex h-[147px] items-center justify-between rounded-lg border border-[#C8CEE0] bg-white px-8 shadow-sm">
      <div>
        <p className="text-sm font-semibold text-[#4E5363]">{label}</p>
        <p className="mt-2 text-[48px] font-extrabold leading-none text-[#0D329D]">{value}</p>
      </div>
      <div className={`flex h-14 w-14 items-center justify-center rounded-xl ${tones[tone]}`}>
        <Icon className="h-7 w-7" strokeWidth={2.3} />
      </div>
    </div>
  )
}

export default EOStatCard
