import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'

export function ForgotPassword() {
  const { requestPasswordReset } = useAuth()
  const { showToast } = useToast()
  const [email, setEmail] = useState('')
  const [code, setCode] = useState('')

  const submit = (e) => {
    e.preventDefault()
    if (!email.trim()) {
      showToast('Enter your email.', 'error')
      return
    }
    const c = requestPasswordReset(email.trim())
    setCode(c)
    showToast(`Demo reset code (expires in 30m): ${c}`, 'success')
  }

  return (
    <div className="mx-auto max-w-md">
      <div className="glass rounded-3xl border border-slate-600/25 p-8">
        <h1 className="font-display text-2xl font-bold text-slate-50">Forgot password</h1>
        <p className="mt-2 text-sm text-muted">Demo flow — code stored locally. Production: send email via backend.</p>
        <form onSubmit={submit} className="mt-6 space-y-4">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="focus-ring w-full rounded-xl border border-slate-600/40 bg-surface-0/90 px-4 py-3 text-sm"
            placeholder="Email"
          />
          <button type="submit" className="w-full rounded-2xl bg-accent py-3 text-sm font-bold text-white">
            Generate reset code
          </button>
        </form>
        {code ? (
          <p className="mt-4 rounded-xl bg-surface-2 p-3 font-mono text-sm text-accent-2">
            Use this code on the reset page: <strong>{code}</strong>
          </p>
        ) : null}
        <p className="mt-6 text-center text-sm">
          <Link to="/auth/reset" className="text-accent hover:underline">
            Already have a code?
          </Link>
        </p>
        <p className="mt-2 text-center text-sm">
          <Link to="/auth" className="text-muted hover:text-accent">
            ← Back to sign in
          </Link>
        </p>
      </div>
    </div>
  )
}
