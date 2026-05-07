const variants = {
  primary: 'bg-primary text-white hover:bg-primaryDark shadow-lg shadow-primary/25',
  secondary: 'bg-white text-textDark hover:bg-slate-50 shadow',
  outline: 'border border-slate-200 bg-white text-textDark hover:border-primary hover:text-primary',
}

function Button({
  children,
  variant = 'primary',
  className = '',
  onClick,
  type = 'button',
  disabled = false,
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`inline-flex h-14 items-center justify-center rounded-xl px-5 text-sm font-bold transition disabled:cursor-not-allowed disabled:opacity-70 ${variants[variant]} ${className}`}
    >
      {children}
    </button>
  )
}

export default Button
