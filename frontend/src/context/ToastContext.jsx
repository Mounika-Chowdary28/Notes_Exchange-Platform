import { createContext, useCallback, useContext, useMemo, useState } from 'react'

const ToastContext = createContext(null)

export function ToastProvider({ children }) {
  const [toast, setToast] = useState(null)

  const showToast = useCallback((message, variant = 'info') => {
    const id = crypto.randomUUID?.() ?? String(Date.now())
    setToast({ id, message, variant })
    window.setTimeout(() => setToast((t) => (t?.id === id ? null : t)), 3200)
  }, [])

  const value = useMemo(() => ({ showToast, toast }), [showToast, toast])

  return <ToastContext.Provider value={value}>{children}</ToastContext.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components -- paired hook for provider
export function useToast() {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast must be used within ToastProvider')
  return ctx
}
