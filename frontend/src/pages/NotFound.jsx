import { Link } from 'react-router-dom'

export function NotFound() {
  return (
    <div className="glass mx-auto max-w-lg rounded-3xl py-16 text-center">
      <p className="font-display text-6xl font-bold text-accent/80">404</p>
      <h1 className="mt-4 font-display text-2xl text-gray-900">This page drifted away</h1>
      <p className="mt-2 text-sm text-muted">Check the URL or head back to browse.</p>
      <Link
        to="/"
        className="mt-8 inline-flex rounded-2xl bg-accent px-6 py-3 text-sm font-bold text-white hover:brightness-110"
      >
        Go home
      </Link>
    </div>
  )
}
