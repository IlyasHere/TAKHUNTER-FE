import { Bookmark, CalendarDays, MapPin, Star } from 'lucide-react'
import Button from '../ui/Button'
import Card from '../ui/Card'

function EventCard({ event, onClick, onToggleBookmark }) {
  const badgeStyle =
    event.type === 'WAJIB'
      ? 'bg-primary/95 text-white'
      : 'bg-slate-100/95 text-[#677084]'

  return (
    <Card className="group cursor-pointer overflow-hidden border-0 shadow-[0_10px_24px_rgba(31,41,55,0.06)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_18px_38px_rgba(71,88,224,0.16)]">
      <div className="relative h-[193px] overflow-hidden rounded-t-[18px]">
        <img
          src={event.image}
          alt={event.title}
          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
        />
        <span className={`absolute left-5 top-4 rounded-full px-4 py-1.5 text-xs font-bold capitalize ${badgeStyle}`}>
          {event.type.toLowerCase()}
        </span>
      </div>

      <div className="p-6">
        <div className="flex items-start justify-between gap-4">
          <h3 className="min-h-[52px] text-[22px] font-extrabold leading-tight text-[#171B29]">{event.title}</h3>
          <button
            className={`mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition hover:bg-primary/10 ${
              event.saved ? 'text-primary' : 'text-[#9BA1B2]'
            }`}
            type="button"
            onClick={(clickEvent) => {
              clickEvent.stopPropagation()
              onToggleBookmark?.(event)
            }}
            aria-label={event.saved ? 'Hapus bookmark' : 'Simpan bookmark'}
          >
            <Bookmark className="h-[21px] w-[21px]" fill={event.saved ? 'currentColor' : 'none'} strokeWidth={2} />
          </button>
        </div>

        <div className="mt-4 space-y-3 text-[15px] font-medium text-[#626A7E]">
          <div className="flex items-center gap-3">
            <CalendarDays className="h-[18px] w-[18px] text-[#687086]" />
            <span>{event.date} • {event.time}</span>
          </div>
          <div className="flex items-center gap-3">
            <MapPin className="h-[18px] w-[18px] text-[#687086]" />
            <span>{event.location}</span>
          </div>
        </div>

        <p className="mt-5 min-h-[48px] text-[15px] font-medium leading-6 text-[#626A7E]">
          {event.description}
        </p>

        <div className="mt-5 border-t border-[#E2E4EC] pt-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-primary">
              <Star className="h-[19px] w-[19px]" />
              <span className="text-base font-extrabold">{event.points} Poin</span>
            </div>
            
            {/* Pasang onClick pada Button */}
            <Button 
              onClick={onClick}
              className="h-10 rounded-xl px-5 text-sm shadow-none"
            >
              Lihat Detail
            </Button>
          </div>
        </div>
      </div>
    </Card>
  )
}

export default EventCard
