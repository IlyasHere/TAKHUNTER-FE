import { Star } from 'lucide-react'
import EventCard from '../../components/cards/EventCard'
import LatestEventCard from '../../components/cards/LatestEventCard'
import DashboardLayout from '../../components/layout/DashboardLayout'
import Card from '../../components/ui/Card'
import { categories, dummyEvents } from '../../data/dummyEvents'

function DashboardPage() {
  return (
    <DashboardLayout title="Dashboard Mahasiswa">
      <section className="grid gap-6 xl:grid-cols-[335px_1fr]">
        <div>
          <Card className="border-[#D9DEEE] p-6 shadow-none transition duration-300 hover:-translate-y-0.5 hover:shadow-[0_14px_34px_rgba(71,88,224,0.12)]">
            <h2 className="text-[22px] font-extrabold text-[#171B29]">Halo, Ilyas</h2>
            <p className="mt-2 text-[15px] font-medium text-[#7A8298]">Selamat datang kembali di TAK App.</p>

            <div className="mt-4 flex h-[66px] w-[224px] items-center justify-between rounded-2xl bg-gradient-to-r from-[#2F73F6] to-[#4770F4] px-6 text-white">
              <div>
                <p className="text-xs font-medium text-white/85">Total Poin TAK</p>
                <p className="mt-1 text-[30px] font-light leading-none">
                  120<span className="ml-1 text-base font-medium">Poin</span>
                </p>
              </div>
              <Star className="h-9 w-9 fill-yellow-300 text-yellow-300" />
            </div>
          </Card>

          <div className="mt-6 flex flex-wrap gap-3">
            {categories.map((category, index) => (
              <button
                key={category}
                className={`h-8 rounded-[10px] border px-4 text-xs font-extrabold transition hover:-translate-y-0.5 ${
                  index === 0
                    ? 'border-primary bg-primary text-white shadow-[0_8px_16px_rgba(71,88,224,0.18)]'
                    : 'border-[#AEB5C7] bg-transparent text-[#9BA1AE] hover:border-primary hover:text-primary'
                }`}
                type="button"
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        <Card className="border-[#D9DEEE] p-6 shadow-none transition duration-300 hover:-translate-y-0.5 hover:shadow-[0_14px_34px_rgba(71,88,224,0.12)]">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-[18px] font-extrabold text-[#171B29]">Kegiatan Terbaru</h2>
            <button className="text-xs font-extrabold text-primary" type="button">Lihat semua</button>
          </div>
          <div className="grid gap-6 md:grid-cols-2">
            {dummyEvents.slice(0, 2).map((event) => (
              <LatestEventCard key={event.id} event={event} />
            ))}
          </div>
        </Card>
      </section>

      <section className="mt-10">
        <h2 className="mb-9 text-[22px] font-extrabold text-[#171B29]">Kegiatan Tersedia</h2>

        <div className="grid gap-6 xl:grid-cols-3">
          {dummyEvents.slice(0, 3).map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      </section>
    </DashboardLayout>
  )
}

export default DashboardPage
