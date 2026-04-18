import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { BRANCHES, SEMESTERS } from '../data/mockData'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'

export function Auth() {
  const { login, signup } = useAuth()
  const { showToast } = useToast()
  const navigate = useNavigate()
  const location = useLocation()
  const from = location.state?.from || '/dashboard'

  const [mode, setMode] = useState(location.state?.mode || 'login')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [rememberMe, setRememberMe] = useState(true)
  const [asAdmin, setAsAdmin] = useState(false)
  const [branch, setBranch] = useState('CSE')
  const [semester, setSemester] = useState('4')

  const [loading, setLoading] = useState(false)

  const submit = async (e) => {
    e.preventDefault()
    if (!email.trim()) {
      showToast('Please enter your email.', 'error')
      return
    }
    setLoading(true)
    try {
      if (mode === 'signup') {
        if (password.length < 6) {
          showToast('Use at least 6 characters for password.', 'error')
          return
        }
        await signup(name, email.trim(), password, { branch, semester, rememberMe })
        showToast('Account created successfully!', 'success')
      } else {
        if (!password) {
          showToast('Please enter your password.', 'error')
          return
        }
        await login(email.trim(), password, { rememberMe })
        showToast('Signed in successfully.', 'success')
      }
      navigate(from, { replace: true })
    } catch (error) {
      showToast(error.message, 'error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mx-auto max-w-md">
      <div className="glass glow-accent rounded-3xl border border-accent/15 p-8 sm:p-10">
        <h1 className="text-center font-display text-3xl font-bold text-gray-900">
          {mode === 'login' ? 'Welcome back' : 'Create your account'}
        </h1>
        <p className="mt-2 text-center text-sm text-muted">
          JWT-ready session · <span className="text-calm">Student</span> or <span className="text-warm">Admin</span> roles (demo).
        </p>

        <div className="mt-8 flex rounded-2xl bg-surface-1 p-1">
          <button
            type="button"
            onClick={() => setMode('login')}
            className={`focus-ring flex-1 rounded-xl py-2.5 text-sm font-semibold transition ${
              mode === 'login' ? 'bg-white text-accent shadow' : 'text-muted hover:text-gray-700'
            }`}
          >
            Log in
          </button>
          <button
            type="button"
            onClick={() => setMode('signup')}
            className={`focus-ring flex-1 rounded-xl py-2.5 text-sm font-semibold transition ${
              mode === 'signup' ? 'bg-white text-accent shadow' : 'text-muted hover:text-gray-700'
            }`}
          >
            Sign up
          </button>
        </div>

        <form onSubmit={submit} className="mt-8 space-y-4">
          {mode === 'signup' ? (
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Name
              </label>
              <input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="focus-ring mt-1.5 w-full rounded-xl border border-gray-300 bg-white/95 px-4 py-3 text-gray-900"
                placeholder="Rahul Kumar"
                autoComplete="name"
              />
            </div>
          ) : null}

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="branch" className="block text-sm font-medium text-gray-700">
                Branch
              </label>
              <select
                id="branch"
                value={branch}
                onChange={(e) => setBranch(e.target.value)}
                className="focus-ring mt-1.5 w-full rounded-xl border border-gray-300 bg-white/95 px-4 py-3 text-sm text-gray-900"
              >
                {BRANCHES.map((b) => (
                  <option key={b} value={b}>
                    {b}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="sem" className="block text-sm font-medium text-gray-700">
                Semester
              </label>
              <select
                id="sem"
                value={semester}
                onChange={(e) => setSemester(e.target.value)}
                className="focus-ring mt-1.5 w-full rounded-xl border border-gray-300 bg-white/95 px-4 py-3 text-sm text-gray-900"
              >
                {SEMESTERS.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="focus-ring mt-1.5 w-full rounded-xl border border-gray-300 bg-white/95 px-4 py-3 text-gray-900"
              placeholder="you@college.edu"
              autoComplete="email"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="focus-ring mt-1.5 w-full rounded-xl border border-gray-300 bg-white/95 px-4 py-3 text-gray-900"
              placeholder="••••••••"
              autoComplete={mode === 'signup' ? 'new-password' : 'current-password'}
            />
          </div>

          <label className="flex items-center gap-2 text-sm text-gray-700">
            <input type="checkbox" checked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)} />
            Remember me on this device
          </label>

          {mode === 'login' ? (
            <label className="flex items-center gap-2 text-sm text-warm">
              <input type="checkbox" checked={asAdmin} onChange={(e) => setAsAdmin(e.target.checked)} />
              Sign in as Admin (demo role flag)
            </label>
          ) : null}

          <button
            type="submit"
            disabled={loading}
            className="focus-ring w-full rounded-2xl bg-accent py-3.5 text-base font-bold text-white transition hover:brightness-110 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (mode === 'login' ? 'Signing in...' : 'Creating account...') : (mode === 'login' ? 'Log in' : 'Create account')}
          </button>
        </form>

        {mode === 'login' ? (
          <p className="mt-4 text-center text-sm">
            <Link to="/auth/forgot" className="text-calm hover:underline">
              Forgot password?
            </Link>
          </p>
        ) : null}

        <p className="mt-6 text-center text-sm text-muted">
          <Link to="/browse" className="text-accent hover:underline">
            Continue browsing without an account
          </Link>
        </p>
      </div>
    </div>
  )
}
