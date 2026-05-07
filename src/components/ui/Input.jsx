import { useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'

function Input({
  label,
  icon: Icon,
  rightIcon: RightIcon,
  placeholder,
  type = 'text',
  className = '',
  inputClassName = '',
  ...props
}) {
  const [showPassword, setShowPassword] = useState(false)
  const isPassword = type === 'password'
  const inputType = isPassword && showPassword ? 'text' : type
  const PasswordIcon = showPassword ? EyeOff : Eye

  return (
    <label className={`block ${className}`}>
      {label ? (
        <span className="mb-3 block text-sm font-bold text-primary">{label}</span>
      ) : null}
      <div className="flex h-14 items-center rounded-xl border border-white/30 bg-white/35 px-4 text-slate-700 shadow-sm">
        {Icon ? <Icon className="mr-4 h-5 w-5 shrink-0 text-slate-600" strokeWidth={1.8} /> : null}
        <input
          type={inputType}
          placeholder={placeholder}
          className={`h-full min-w-0 flex-1 bg-transparent text-sm font-semibold text-textDark outline-none placeholder:text-gray-600 ${inputClassName}`}
          {...props}
        />
        {isPassword ? (
          <button
            type="button"
            className="ml-3 flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-slate-600 transition hover:bg-white/35 hover:text-primary"
            onClick={() => setShowPassword((current) => !current)}
            aria-label={showPassword ? 'Sembunyikan password' : 'Tampilkan password'}
          >
            <PasswordIcon className="h-5 w-5" strokeWidth={1.8} />
          </button>
        ) : RightIcon ? (
          <RightIcon className="ml-3 h-5 w-5 shrink-0 text-slate-600" strokeWidth={1.8} />
        ) : null}
      </div>
    </label>
  )
}

export default Input
