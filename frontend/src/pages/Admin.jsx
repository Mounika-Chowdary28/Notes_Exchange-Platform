import { useNotes } from '../context/NotesContext'
import { useToast } from '../context/ToastContext'

export function Admin() {
  const { reports, verifyNote, notes } = useNotes()
  const { showToast } = useToast()

  return (
    <div className="space-y-8">
      <header>
        <h1 className="font-display text-3xl font-bold text-slate-50">Admin moderation</h1>
        <p className="mt-2 text-muted">Review reports and mark faculty-verified (demo queue).</p>
      </header>
      <section className="glass rounded-2xl border border-warm/25 p-6">
        <h2 className="text-lg font-semibold text-gray-900">Open reports ({reports.length})</h2>
        <ul className="mt-4 space-y-3 text-sm">
          {reports.length === 0 ? <li className="text-muted">No reports — great job.</li> : null}
          {reports.map((r) => {
            const n = notes.find((x) => x.id === r.noteId)
            return (
              <li key={r.id} className="rounded-xl border border-slate-600/30 bg-surface-1/60 p-4">
                <p className="font-mono text-xs text-accent-2">{r.reason}</p>
                <p className="mt-1 text-gray-700">{n?.title || r.noteId}</p>
                <p className="text-xs text-muted">{r.detail}</p>
                <p className="text-xs text-muted">
                  by {r.byName || r.byUser} · {new Date(r.at).toLocaleString()}
                </p>
                <button
                  type="button"
                  onClick={() => {
                    verifyNote(r.noteId)
                    showToast('Marked faculty-verified.', 'success')
                  }}
                  className="mt-2 rounded-lg bg-accent px-3 py-1 text-xs font-bold text-white"
                >
                  Verify note
                </button>
              </li>
            )
          })}
        </ul>
      </section>
    </div>
  )
}
