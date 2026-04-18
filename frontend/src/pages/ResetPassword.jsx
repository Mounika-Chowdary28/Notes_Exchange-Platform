import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'

export function ResetPassword() {
  const { resetPassword } = useAuth()
  const { showToast } = useToast()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [code, setCode] = useState('')
  const [pw, setPw] = useState('')

  const submit = (e) => {
    e.preventDefault()
    const res = resetPassword(email, code, pw)
    if (!res.ok) {
      showToast(res.error || 'Reset failed', 'error')
      return
    }
    showToast('Password reset (demo). You can sign in again.', 'success')
    navigate('/auth')
  }

  return (
    <div className="mx-auto max-w-md">
      <div className="glass rounded-3xl border border-slate-600/25 p-8">
        <h1 className="font-display text-2xl font-bold text-slate-50">Reset password</h1>
        <form onSubmit={submit} className="mt-6 space-y-4">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="focus-ring w-full rounded-xl border border-slate-600/40 bg-surface-0/90 px-4 py-3 text-sm"
            placeholder="Email"
            required
          />
          <input
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="focus-ring w-full rounded-xl border border-slate-600/40 bg-surface-0/90 px-4 py-3 text-sm"
            placeholder="6-digit code"
            required
          />
          <input
            type="password"
            value={pw}
            onChange={(e) => setPw(e.target.value)}
            className="focus-ring w-full rounded-xl border border-slate-600/40 bg-surface-0/90 px-4 py-3 text-sm"
            placeholder="New password"
            minLength={6}
            required
          />
          <button type="submit" className="w-full rounded-2xl bg-accent py-3 text-sm font-bold text-white">
            Update password
          </button>
        </form>
        <p className="mt-6 text-center text-sm">
          <Link to="/auth" className="text-muted hover:text-accent">
            ← Back to sign in
          </Link>
        </p>
      </div>
    </div>
  )
}
