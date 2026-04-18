import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { useNotes } from '../context/NotesContext'

export function Analytics() {
  const { notes, analytics, downloadLog } = useNotes()

  const topSearched = useMemo(() => {
    const m = {}
    notes.forEach((n) => {
      m[n.subjectCode] = (m[n.subjectCode] || 0) + 1
    })
    return Object.entries(m)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
  }, [notes])

  const topNote = (id) => notes.find((n) => n.id === id)

  return (
    <div className="space-y-10">
      <header>
        <h1 className="font-display text-3xl font-bold text-slate-50">Download analytics</h1>
        <p className="mt-2 text-muted">Demo dashboard — aggregates from local activity + seed catalog.</p>
      </header>
      <div className="grid gap-4 md:grid-cols-2">
        <div className="glass rounded-2xl border border-slate-600/25 p-5">
          <h2 className="text-sm font-semibold uppercase text-muted">Most downloaded today</h2>
          <p className="mt-2 font-display text-xl text-gray-900">
            {analytics.topTodayId ? (
              <Link className="text-accent hover:underline" to={`/notes/${analytics.topTodayId}`}>
                {topNote(analytics.topTodayId)?.title || analytics.topTodayId}
              </Link>
            ) : (
              '—'
            )}
          </p>
          <p className="text-xs text-muted">{analytics.topTodayN} logged hits today</p>
        </div>
        <div className="glass rounded-2xl border border-slate-600/25 p-5">
          <h2 className="text-sm font-semibold uppercase text-muted">Most downloaded this week</h2>
          <p className="mt-2 font-display text-xl text-gray-900">
            {analytics.topWeekId ? (
              <Link className="text-accent hover:underline" to={`/notes/${analytics.topWeekId}`}>
                {topNote(analytics.topWeekId)?.title || analytics.topWeekId}
              </Link>
            ) : (
              '—'
            )}
          </p>
          <p className="text-xs text-muted">{analytics.topWeekN} hits (7d)</p>
        </div>
        <div className="glass rounded-2xl border border-slate-600/25 p-5">
          <h2 className="text-sm font-semibold uppercase text-muted">Trending subject (by downloads)</h2>
          <p className="mt-2 font-display text-2xl text-accent-2">{analytics.trendingSubject || '—'}</p>
        </div>
        <div className="glass rounded-2xl border border-slate-600/25 p-5">
          <h2 className="text-sm font-semibold uppercase text-muted">Events logged</h2>
          <p className="mt-2 font-display text-2xl text-warm">{downloadLog.length}</p>
          <p className="text-xs text-muted">Download events in local history</p>
        </div>
      </div>
      <section className="glass rounded-2xl border border-slate-600/25 p-5">
        <h2 className="font-display text-lg font-semibold text-gray-900">Top contributors (upload count)</h2>
        <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm text-gray-700">
          {analytics.topContributors.map((c) => (
            <li key={c.userId}>
              {c.userId} · {c.count} uploads
            </li>
          ))}
        </ol>
      </section>
      <section className="glass rounded-2xl border border-slate-600/25 p-5">
        <h2 className="font-display text-lg font-semibold text-gray-900">Catalog coverage by subject code</h2>
        <ul className="mt-3 space-y-1 text-sm text-muted">
          {topSearched.map(([code, n]) => (
            <li key={code}>
              <span className="font-mono text-accent-2">{code}</span> · {n} notes indexed
            </li>
          ))}
        </ul>
      </section>
    </div>
  )
}
