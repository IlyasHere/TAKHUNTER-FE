function Badge({ children, variant = 'wajib', className = '' }) {
  const styles =
    variant === 'wajib'
      ? 'bg-primary/10 text-primary'
      : 'bg-emerald-50 text-emerald-600'

  return (
    <span className={`inline-flex rounded-full px-3 py-1 text-xs font-bold ${styles} ${className}`}>
      {children}
    </span>
  )
}

export default Badge
