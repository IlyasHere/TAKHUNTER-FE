import { CalendarDays } from 'lucide-react'

function LatestEventCard({ event, onClick }) {
  const badgeStyle =
    event.type === 'WAJIB'
      ? 'bg-primary text-white'
      : 'bg-[#566072] text-white'

  return (
    <article onClick={onClick} className="group cursor-pointer">
      <div className="relative h-[136px] overflow-hidden rounded-[10px]">
        <img
          src={event.thumb}
          alt={event.title}
          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
        />
        <span className={`absolute left-2 top-2 rounded px-2.5 py-1 text-[11px] font-extrabold ${badgeStyle}`}>
          {event.type}
        </span>
      </div>
      <h3 className="mt-2 min-h-[38px] text-[15px] font-extrabold leading-tight text-[#1A1D2B]">
        {event.title}
      </h3>
      <div className="mt-3 flex items-center justify-between text-xs font-semibold">
        <div className="flex items-center gap-1.5 text-[#96A0B5]">
          <CalendarDays className="h-3.5 w-3.5" />
          <span>{event.date}</span>
        </div>
        <span className="font-extrabold text-primary">{event.points} Poin</span>
      </div>
    </article>
  )
}

export default LatestEventCard