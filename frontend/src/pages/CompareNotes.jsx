import { useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { QualityBadge } from '../components/QualityBadge'
import { VoteControl } from '../components/VoteControl'
import { useNotes } from '../context/NotesContext'
import { computeQualityScore } from '../utils/qualityScore'

export function CompareNotes() {
  const { notes, getNote, score, getBookmarkCount } = useNotes()
  const [params, setParams] = useSearchParams()
  const [a, setA] = useState(() => params.get('a') || '')
  const [b, setB] = useState(() => params.get('b') || '')

  const aId = a || notes[0]?.id || ''
  const bId = b || notes[1]?.id || notes[0]?.id || ''

  const na = getNote(aId)
  const nb = getNote(bId)

  const rows = useMemo(() => {
    if (!na || !nb) return []
    const sa = score(na)
    const sb = score(nb)
    return [
      { label: 'Net votes', va: sa.net, vb: sb.net },
      { label: 'Total votes', va: sa.up + sa.down, vb: sb.up + sb.down },
      { label: 'Downloads', va: na.downloads, vb: nb.downloads },
      { label: 'Views', va: na.views ?? 0, vb: nb.views ?? 0 },
      {
        label: 'Quality score',
        va: computeQualityScore(na, sa.net, getBookmarkCount(na)),
        vb: computeQualityScore(nb, sb.net, getBookmarkCount(nb)),
      },
      { label: 'Version', va: na.versionLabel || `v${na.version}`, vb: nb.versionLabel || `v${nb.version}` },
    ]
  }, [na, nb, score, getBookmarkCount])

  const sync = () => {
    const p = new URLSearchParams()
    if (aId) p.set('a', aId)
    if (bId) p.set('b', bId)
    setParams(p)
  }

  return (
    <div className="space-y-8">
      <header>
        <h1 className="font-display text-3xl font-bold text-slate-50">Compare notes</h1>
        <p className="mt-2 text-muted">Side-by-side ratings, downloads, views, and quality.</p>
      </header>
      <div className="grid gap-4 md:grid-cols-2">
        <label className="text-sm text-muted">
          Note A
          <select
            value={aId}
            onChange={(e) => setA(e.target.value)}
            className="focus-ring mt-1 w-full rounded-xl border border-slate-600/40 bg-surface-0/90 px-3 py-2 text-sm"
          >
            {notes.map((n) => (
              <option key={n.id} value={n.id}>
                {n.subjectCode} — {n.title}
              </option>
            ))}
          </select>
        </label>
        <label className="text-sm text-muted">
          Note B
          <select
            value={bId}
            onChange={(e) => setB(e.target.value)}
            className="focus-ring mt-1 w-full rounded-xl border border-slate-600/40 bg-surface-0/90 px-3 py-2 text-sm"
          >
            {notes.map((n) => (
              <option key={n.id} value={n.id}>
                {n.subjectCode} — {n.title}
              </option>
            ))}
          </select>
        </label>
      </div>
      <button type="button" onClick={sync} className="rounded-xl border border-accent/40 px-4 py-2 text-sm text-accent">
        Update URL params
      </button>
      {na && nb ? (
        <div className="grid gap-6 lg:grid-cols-2">
          {[na, nb].map((n) => (
            <div key={n.id} className="glass rounded-2xl border border-slate-600/25 p-5">
              <h2 className="font-display text-lg font-semibold text-gray-900">{n.title}</h2>
              <p className="text-sm text-muted">
                {n.subject} · {n.subjectCode}
              </p>
              <div className="mt-3">
                <QualityBadge note={n} />
              </div>
              <div className="mt-4">
                <VoteControl noteId={n.id} />
              </div>
              <Link to={`/notes/${n.id}`} className="mt-4 inline-block text-sm text-accent hover:underline">
                Open detail →
              </Link>
            </div>
          ))}
        </div>
      ) : null}
      {rows.length ? (
        <div className="glass overflow-x-auto rounded-2xl border border-slate-600/25">
          <table className="w-full min-w-[480px] text-left text-sm">
            <thead>
              <tr className="border-b border-slate-600/30 text-muted">
                <th className="p-3">Metric</th>
                <th className="p-3">A</th>
                <th className="p-3">B</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.label} className="border-b border-slate-600/15">
                  <td className="p-3 text-slate-400">{r.label}</td>
                  <td className="p-3 font-mono text-accent-2">{r.va}</td>
                  <td className="p-3 font-mono text-warm">{r.vb}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : null}
    </div>
  )
}
