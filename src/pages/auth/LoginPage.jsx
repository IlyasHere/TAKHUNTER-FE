import { useState } from 'react'
import { EyeOff, Lock, User } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import AuthLayout from '../../components/layout/AuthLayout'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'
import { loginUser } from '../../services/authService'

function LoginPage() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  const handleLogin = async (event) => {
    event.preventDefault()
    setLoading(true)
    setErrorMessage('')

    try {
      const data = await loginUser({ email, password })
      const role = data.user?.role

      localStorage.setItem('token', data.token)
      localStorage.setItem('user', JSON.stringify(data.user))

      if (role === 'EVENT_ORGANIZER') {
        navigate('/event-organizer/dashboard')
        return
      }

      navigate('/dashboard')
    } catch (error) {
      setErrorMessage(error.message || 'Login gagal. Silakan coba lagi.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthLayout activeTab="login" cardSize="login">
      <form className="flex h-full flex-col justify-center" onSubmit={handleLogin}>
        <Input
          label="email"
          icon={User}
          placeholder="email"
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
          className="mt-6"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          autoComplete="current-password"
          required
        />

        <div className="mt-2 flex justify-end">
          <Link to="/login" className="text-xs font-bold text-primary hover:text-primaryDark">
            Forgot Password?
          </Link>
        </div>

        {errorMessage ? (
          <p className="mt-4 rounded-xl border border-red-200 bg-red-50/80 px-4 py-3 text-sm font-semibold text-red-600">
            {errorMessage}
          </p>
        ) : null}

        <Button type="submit" className="mt-7 w-full text-base" disabled={loading}>
          {loading ? 'Loading...' : 'Login'}
        </Button>

        <p className="mt-5 text-center text-xs font-bold text-slate-900">
          Don&apos;t have account?{' '}
          <Link to="/register" className="text-primary hover:text-primaryDark">
            Register
          </Link>
        </p>
      </form>
    </AuthLayout>
  )
}

export default LoginPage
