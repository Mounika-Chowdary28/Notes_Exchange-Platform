import { Link } from 'react-router-dom'

export function Logo({ className = '' }) {
  return (
    <Link to="/" className={`group inline-flex items-center gap-2 ${className}`}>
      <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-accent via-calm to-warm font-display text-lg font-bold text-white shadow-md glow-accent">
        N
      </span>
      <span className="font-display text-lg font-semibold tracking-tight text-accent transition group-hover:text-accent-dim">
        Notes Exchange
      </span>
    </Link>
  )
}
