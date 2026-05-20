import { useState } from 'react'
import { EyeOff, GraduationCap, Lock, Mail, User } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import AuthLayout from '../../components/layout/AuthLayout'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'
import { registerUser } from '../../services/authService'

function RegisterPage() {
  const navigate = useNavigate()
  const [role, setRole] = useState('MAHASISWA')
  const [name, setName] = useState('')
  const [nim, setNim] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const isMahasiswa = role === 'MAHASISWA'

  const accountButtonClass = (type) =>
    `h-14 rounded-xl border text-sm font-bold shadow-sm transition duration-200 hover:-translate-y-0.5 hover:shadow-lg active:scale-[0.98] ${
      role === type
        ? 'border-primary bg-primary text-white shadow-primary/25'
        : 'border-white/35 bg-white/25 text-slate-900 hover:border-primary/40 hover:bg-white/40 hover:text-primary'
    }`

  const handleRegister = async (event) => {
    event.preventDefault()
    setLoading(true)
    setErrorMessage('')

    const payload = {
      name,
      email,
      password,
      role,
      ...(isMahasiswa ? { nim } : {}),
    }

    try {
      const data = await registerUser(payload)
      const authenticatedUser = data.user || {
        name,
        email,
        role,
        ...(isMahasiswa ? { nim } : {}),
      }
      const userRole = authenticatedUser.role

      localStorage.setItem('token', data.token)
      localStorage.setItem('user', JSON.stringify(authenticatedUser))

      if (userRole === 'EVENT_ORGANIZER') {
        navigate('/event-organizer/dashboard')
        return
      }

      navigate('/dashboard')
    } catch (error) {
      setErrorMessage(error.message || 'Registrasi gagal. Silakan coba lagi.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthLayout activeTab="register" cardSize="register">
      <form onSubmit={handleRegister}>
        <h2 className="text-center text-base font-extrabold text-primary">Pilih Jenis Akun</h2>
        <div className="mt-4 grid grid-cols-2 gap-4">
          <button
            className={accountButtonClass('MAHASISWA')}
            type="button"
            onClick={() => setRole('MAHASISWA')}
          >
            Mahasiswa
          </button>
          <button
            className={accountButtonClass('EVENT_ORGANIZER')}
            type="button"
            onClick={() => setRole('EVENT_ORGANIZER')}
          >
            Event Organizer
          </button>
        </div>

        <div className="my-7 flex items-center gap-4">
          <div className="h-px flex-1 bg-primary/45" />
          <span className="text-sm font-bold text-primary">Register</span>
          <div className="h-px flex-1 bg-primary/45" />
        </div>

        <Input
          label="Username"
          icon={User}
          placeholder="Username"
          value={name}
          onChange={(event) => setName(event.target.value)}
          autoComplete="name"
          required
        />
        {isMahasiswa ? (
          <Input
            label="NIM"
            icon={GraduationCap}
            placeholder="NIM"
            className="mt-5"
            value={nim}
            onChange={(event) => setNim(event.target.value)}
            required
          />
        ) : null}
        <Input
          label="Email"
          icon={Mail}
          placeholder="Email"
          type="email"
          className="mt-5"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          autoComplete="email"
          required
        />
        <Input
          label="Password"
          icon={Lock}
          rightIcon={EyeOff}
          placeholder="Password"
          type="password"
          className="mt-5"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          autoComplete="new-password"
          minLength={8}
          required
        />

        <p className="mt-3 text-xs font-semibold text-primary">Minimum lenght is 8 characters.</p>

        {errorMessage ? (
          <p className="mt-4 rounded-xl border border-red-200 bg-red-50/80 px-4 py-3 text-sm font-semibold text-red-600">
            {errorMessage}
          </p>
        ) : null}

        <Button type="submit" className="mt-7 w-full text-base" disabled={loading}>
          {loading ? 'Loading...' : 'Sign Up'}
        </Button>
      </form>
    </AuthLayout>
  )
}

export default RegisterPage
