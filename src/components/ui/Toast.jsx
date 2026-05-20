import { CheckCircle2, X } from 'lucide-react'

function Toast({ message, onClose }) {
  if (!message) return null

  return (
    <div className="fixed bottom-5 left-5 z-50 flex w-[calc(100%-2.5rem)] max-w-sm items-start gap-3 rounded-xl border border-[#BFE8CD] bg-white px-4 py-3 text-[#166534] shadow-[0_18px_46px_rgba(22,101,52,0.18)]">
      <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-[#16A34A]" strokeWidth={2.4} />
      <p className="min-w-0 flex-1 text-sm font-extrabold leading-relaxed">{message}</p>
      <button type="button" className="rounded-md p-1 text-[#4B8060] transition hover:bg-[#ECFDF3]" onClick={onClose} aria-label="Tutup pesan">
        <X className="h-4 w-4" strokeWidth={2.4} />
      </button>
    </div>
  )
}

export default Toast
