import { useMemo } from 'react'
import { Link, useParams } from 'react-router-dom'
import { NoteCard } from '../components/NoteCard'
import { useNotes } from '../context/NotesContext'

export function Roadmap() {
  const { code } = useParams()
  const { notes } = useNotes()
  const subjectCode = (code || 'CS302').toUpperCase()

  const grouped = useMemo(() => {
    const sub = notes.filter((n) => n.subjectCode === subjectCode)
    const units = {}
    sub.forEach((n) => {
      const u = n.unit || 'General'
      if (!units[u]) units[u] = []
      units[u].push(n)
    })
    return Object.entries(units).sort(([a], [b]) => a.localeCompare(b))
  }, [notes, subjectCode])

  return (
    <div className="space-y-8">
      <header>
        <h1 className="font-display text-3xl font-bold text-slate-50">Subject roadmap</h1>
        <p className="mt-2 text-muted">
          Learning-path style grouping for <span className="font-mono text-accent-2">{subjectCode}</span> — swap code in the URL (
          <code className="text-xs text-muted">/roadmap/CS201</code>).
        </p>
      </header>
      <ol className="space-y-10">
        {grouped.map(([unit, list], idx) => (
          <li key={unit} className="glass rounded-2xl border border-slate-600/25 p-6">
            <p className="text-xs font-bold uppercase tracking-widest text-muted">
              Step {idx + 1}
            </p>
            <h2 className="mt-2 font-display text-2xl font-semibold text-gray-900">{unit}</h2>
            <p className="mt-1 text-sm text-muted">Suggested: review notes → attempt PYQs → check lab/viva packs.</p>
            <div className="mt-4 grid gap-4 md:grid-cols-2">
              {list.map((n) => (
                <NoteCard key={n.id} note={n} />
              ))}
            </div>
          </li>
        ))}
      </ol>
      <p className="text-center text-sm text-muted">
        <Link to="/browse" className="text-accent hover:underline">
          Browse all subjects
        </Link>
      </p>
    </div>
  )
}
