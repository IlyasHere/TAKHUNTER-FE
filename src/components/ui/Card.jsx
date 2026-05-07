function Card({ children, className = '' }) {
  return (
    <div className={`rounded-[18px] border border-slate-100 bg-white shadow-sm ${className}`}>
      {children}
    </div>
  )
}

export default Card
