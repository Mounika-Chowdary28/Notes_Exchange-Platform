import { useToast } from '../context/ToastContext'

const styles = {
  success: 'border-emerald-500/40 bg-emerald-100/80 text-emerald-900',
  error: 'border-rose-500/40 bg-rose-100/80 text-rose-900',
  info: 'border-calm/35 bg-surface-2/95 text-gray-900',
}

export function ToastHost() {
  const { toast } = useToast()
  if (!toast) return null
  const cls = styles[toast.variant] || styles.info
  return (
    <div
      className="pointer-events-none fixed bottom-6 left-1/2 z-[100] -translate-x-1/2 px-4"
      role="status"
    >
      <div
        className={`pointer-events-auto glass rounded-2xl border px-5 py-3 text-sm font-medium shadow-lg ${cls}`}
      >
        {toast.message}
      </div>
    </div>
  )
}
