import { useState } from 'react'
import { Link } from 'react-router-dom'
import { NoteBadges } from './NoteBadges'

export function TrendingCarousel({ items }) {
  const [i, setI] = useState(0)
  const list = items.length ? items : []
  const cur = list[i % list.length]

  if (!cur) return null

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <div className="glass relative overflow-hidden rounded-3xl border border-accent/20">
        <div className="absolute inset-0 bg-gradient-to-r from-accent/8 via-transparent to-calm/8" />
        <div className="relative grid gap-6 p-8 md:grid-cols-[1.2fr_0.8fr] md:items-center">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-calm">Top notes this week</p>
            <h3 className="mt-3 font-display text-2xl font-bold text-gray-900 md:text-3xl">{cur.title}</h3>
            <p className="mt-2 text-sm text-muted">
              {cur.subject} · {cur.subjectCode} · Sem {cur.semester} · {cur.branch}
            </p>
            <div className="mt-3">
              <NoteBadges note={cur} />
            </div>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                to={`/notes/${cur.id}`}
                className="rounded-2xl bg-accent px-5 py-2.5 text-sm font-bold text-white hover:brightness-110"
              >
                Open note
              </Link>
              <button
                type="button"
                onClick={() => setI((x) => (x + 1) % list.length)}
                className="rounded-2xl border border-gray-300 px-5 py-2.5 text-sm font-semibold text-gray-900 hover:bg-surface-2"
              >
                Next →
              </button>
            </div>
          </div>
          <div className="rounded-2xl border border-gray-300/25 bg-white/60 p-6">
            <p className="text-xs font-semibold uppercase text-muted">Carousel picks</p>
            <ol className="mt-3 space-y-2 text-sm">
              {list.slice(0, 5).map((n, idx) => (
                <li key={n.id}>
                  <button
                    type="button"
                    onClick={() => setI(idx)}
                    className={`w-full rounded-lg px-2 py-1.5 text-left hover:bg-surface-2 ${idx === i % list.length ? 'bg-surface-2 text-accent' : 'text-gray-700'}`}
                  >
                    <span className="font-mono text-[10px] text-muted">{n.subjectCode}</span> {n.title}
                  </button>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </div>
  )
}
