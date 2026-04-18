import { useEffect, useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { Chatbot } from '../components/Chatbot'
import { Logo } from '../components/Logo'
import { ToastHost } from '../components/ToastHost'
import { useAuth } from '../context/AuthContext'

const navClass = ({ isActive }) =>
  `rounded-lg px-3 py-1.5 text-xs md:text-sm font-medium transition whitespace-nowrap ${
    isActive ? 'bg-accent text-white shadow-md' : 'text-gray-700 hover:bg-surface-3 hover:text-accent'
  }`

const links = [
  { to: '/browse', label: 'Browse' },
  { to: '/papers', label: 'Papers' },
  { to: '/exam-prep', label: 'Exam Prep' },
  { to: '/collections', label: 'Collections' },
  { to: '/bookmarks', label: 'Saved' },
]

export function AppShell({ children }) {
  const { user, isAuthenticated, isAdmin, logout } = useAuth()
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  const handleLogout = () => {
    setOpen(false)
    logout()
    // Use setTimeout to ensure state is cleared before navigation
    setTimeout(() => {
      navigate('/', { replace: true })
    }, 0)
  }

  return (
    <div className="bg-grid mesh-gradient min-h-screen">
      <a
        href="#main"
        className="focus-ring sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[200] focus:rounded-lg focus:bg-surface-2 focus:px-3 focus:py-2"
      >
        Skip to content
      </a>
      <header className="sticky top-0 z-50 border-b border-accent/10 bg-white/95 backdrop-blur-md shadow-sm">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="flex items-center justify-between gap-4 py-3">
            <Logo />
            <nav className="hidden flex-1 flex-wrap items-center justify-start gap-0.5 lg:flex ml-8" aria-label="Primary">
              {links.map((l) => (
                <NavLink key={l.to} to={l.to} className={navClass}>
                  {l.label}
                </NavLink>
              ))}
              {isAdmin ? (
                <NavLink to="/admin" className={navClass}>
                  Admin
                </NavLink>
              ) : null}
            </nav>
            <div className="flex items-center gap-2">
              {isAuthenticated ? (
                <Link
                  to="/upload"
                  className="hidden sm:inline-flex items-center justify-center rounded-lg bg-accent px-3 py-2 text-xs sm:text-sm font-semibold text-white hover:brightness-110 transition"
                >
                  Upload
                </Link>
              ) : null}
              {isAuthenticated ? (
                <Link
                  to="/dashboard"
                  className="hidden sm:inline-flex items-center justify-center rounded-lg bg-accent/10 px-3 py-2 text-xs sm:text-sm font-medium text-accent hover:bg-accent/20 transition"
                >
                  Dashboard
                </Link>
              ) : null}
              {isAuthenticated ? (
                <>
                  <span className="hidden md:block max-w-[120px] truncate text-xs text-muted xl:max-w-[160px] xl:text-sm" title={user?.email}>
                    {user?.role === 'admin' ? '👑' : ''} {user?.name?.split(' ')[0]}
                  </span>
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="focus-ring rounded-lg border border-gray-300 px-3 py-2 text-xs sm:text-sm text-gray-700 hover:bg-surface-2"
                  >
                    Log out
                  </button>
                </>
              ) : (
                <div className="flex items-center gap-2">
                  <Link
                    to="/auth"
                    state={{ mode: 'login' }}
                    className="focus-ring rounded-lg border border-gray-300 px-3 sm:px-4 py-2 text-xs sm:text-sm font-semibold text-gray-700 hover:bg-surface-2 transition block"
                  >
                    Log in
                  </Link>
                  <Link
                    to="/auth"
                    state={{ mode: 'signup' }}
                    className="focus-ring rounded-lg bg-accent px-3 sm:px-4 py-2 text-xs sm:text-sm font-semibold text-white shadow-md transition hover:brightness-110 block"
                  >
                    Sign up
                  </Link>
                </div>
              )}
            </div>
            <button
              type="button"
              className="focus-ring inline-flex h-10 w-10 items-center justify-center rounded-lg border border-gray-300 text-gray-700 lg:hidden"
              aria-expanded={open}
              aria-label="Menu"
              onClick={() => setOpen((o) => !o)}
            >
              <span className="text-xl leading-none">☰</span>
            </button>
          </div>
          {open ? (
            <div className="border-t border-accent/10 bg-surface-1/98 px-4 py-3 lg:hidden">
            <div className="flex flex-col gap-2">
              {links.map((l) => (
                <NavLink key={l.to} to={l.to} className={navClass} onClick={() => setOpen(false)}>
                  {l.label}
                </NavLink>
              ))}
              {isAdmin ? (
                <NavLink to="/admin" className={navClass} onClick={() => setOpen(false)}>
                  Admin
                </NavLink>
              ) : null}
              {isAuthenticated ? (
                <NavLink
                  to="/upload"
                  className={navClass}
                  onClick={() => setOpen(false)}
                >
                  Upload
                </NavLink>
              ) : null}
              {isAuthenticated ? (
                <NavLink
                  to="/dashboard"
                  className={navClass}
                  onClick={() => setOpen(false)}
                >
                  Dashboard
                </NavLink>
              ) : null}
              {!isAuthenticated ? (
                <div className="flex flex-col gap-2 mt-3">
                  <Link
                    to="/auth"
                    state={{ mode: 'login' }}
                    className="rounded-lg border border-gray-300 py-2 text-center text-sm font-semibold text-gray-700 hover:bg-surface-2 transition block"
                    onClick={() => setOpen(false)}
                  >
                    Log in
                  </Link>
                  <Link
                    to="/auth"
                    state={{ mode: 'signup' }}
                    className="rounded-lg bg-accent py-2 text-center text-sm font-semibold text-white transition hover:brightness-110 block"
                    onClick={() => setOpen(false)}
                  >
                    Sign up
                  </Link>
                </div>
              ) : (
                <button
                  type="button"
                  className="mt-2 rounded-lg border border-gray-300 py-2 text-sm text-gray-700"
                  onClick={handleLogout}
                >
                  Log out
                </button>
              )}
            </div>
            </div>
          ) : null}
        </div>
      </header>

      <main id="main" className="w-full py-0 sm:py-0">
        {children}
      </main>

      <footer className="mt-16 w-full border-t border-accent/10 py-10 text-center text-sm text-muted">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <p>Notes Exchange — Green · Orange · Teal theme.</p>
          <p className="mt-1">
            API: <code className="text-accent">VITE_API_URL</code> · Features run in-browser until wired.
          </p>
        </div>
      </footer>
      <ToastHost />
      <Chatbot />
    </div>
  )
}
