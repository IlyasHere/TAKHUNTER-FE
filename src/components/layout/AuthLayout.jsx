import { Link } from 'react-router-dom'
import authBg from '../../assets/images/BGlogin.png'

function AuthLayout({ activeTab, children, cardSize = 'login' }) {
  const cardWidth = cardSize === 'register' ? 'lg:w-[560px] lg:min-h-[640px]' : 'lg:w-[520px] lg:min-h-[380px]'

  return (
    <main className="relative min-h-screen w-full overflow-hidden font-sans">
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${authBg})` }}
      />
      <div className="absolute inset-0 bg-white/40" />
      <div className="absolute inset-0 bg-gradient-to-tr from-[#4758E0]/80 via-white/30 to-white/50" />

      <div className="relative z-10 flex min-h-screen flex-col items-center justify-center gap-8 px-6 py-10 lg:flex-row lg:justify-between lg:gap-0 lg:px-[120px] lg:py-0">
        <section className="w-full lg:w-[560px]">
          <h1 className="text-[38px] font-extrabold leading-tight tracking-wide text-primary sm:text-[48px]">
            TAK Hunter Application
          </h1>
          <p className="mt-2 text-[18px] font-semibold text-primary sm:text-[20px]">
            Sistem informasi kegiatan dan TAK Mahasiswa
          </p>

          <div className="mt-10 grid h-12 w-[300px] grid-cols-2 rounded-md bg-white shadow-lg">
            <Link
              to="/login"
              className={`flex items-center justify-center rounded-md text-base font-bold transition ${
                activeTab === 'login' ? 'bg-primary text-white shadow-lg shadow-primary/30' : 'bg-white text-black'
              }`}
            >
              Login
            </Link>
            <Link
              to="/register"
              className={`flex items-center justify-center rounded-md text-base font-bold transition ${
                activeTab === 'register' ? 'bg-primary text-white shadow-lg shadow-primary/30' : 'bg-white text-black'
              }`}
            >
              Register
            </Link>
          </div>
        </section>

        <section
          className={`w-full max-w-[560px] rounded-[28px] border border-white/10 bg-white/15 p-7 shadow-2xl backdrop-blur-sm sm:p-10 ${cardWidth}`}
        >
          {children}
        </section>
      </div>

      <p className="absolute bottom-8 left-6 z-10 text-sm font-semibold text-white/80 lg:bottom-[72px] lg:left-[120px] lg:text-base">
        takhuntertelkomuniversity.com
      </p>
    </main>
  )
}

export default AuthLayout
