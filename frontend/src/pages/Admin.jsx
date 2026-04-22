import { useState, useEffect } from 'react'
import { useNotes } from '../context/NotesContext'
import { useToast } from '../context/ToastContext'
import { Link } from 'react-router-dom'

export function Admin() {
  const { reports, verifyNote, notes, deleteNote, analytics, loadAnalytics, loadReports } = useNotes()
  const { showToast } = useToast()
  const [activeTab, setActiveTab] = useState('reports')

  useEffect(() => {
    loadAnalytics()
    loadReports()
  }, [loadAnalytics, loadReports])

  const unverifiedNotes = notes.filter((n) => !n.verifiedFaculty)
  const displayStats = analytics || {
    totalNotes: notes.length,
    totalReports: reports.length,
    unverifiedNotes: unverifiedNotes.length,
    totalUsers: '...',
    totalDownloads: '...',
    totalViews: '...',
  }

  return (
    <div className="space-y-8">
      <header className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold text-slate-50">Admin moderation</h1>
          <p className="mt-1 text-muted">Review reports and manage site content.</p>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-6">
          <StatCard label="Notes" value={displayStats.totalNotes} color="text-accent" />
          <StatCard label="Reports" value={displayStats.totalReports} color="text-danger" />
          <StatCard label="Pending" value={displayStats.unverifiedNotes} color="text-accent-2" />
          <StatCard label="Users" value={displayStats.totalUsers} color="text-indigo-400" />
          <StatCard label="Downloads" value={displayStats.totalDownloads} color="text-emerald-400" />
          <StatCard label="Views" value={displayStats.totalViews} color="text-sky-400" />
        </div>
      </header>

      <div className="flex border-b border-gray-300/20">
        <button
          onClick={() => setActiveTab('reports')}
          className={`px-6 py-3 text-sm font-semibold transition ${
            activeTab === 'reports' ? 'border-b-2 border-accent text-accent' : 'text-muted hover:text-gray-900'
          }`}
        >
          Reports ({reports.length})
        </button>
        <button
          onClick={() => setActiveTab('notes')}
          className={`px-6 py-3 text-sm font-semibold transition ${
            activeTab === 'notes' ? 'border-b-2 border-accent text-accent' : 'text-muted hover:text-gray-900'
          }`}
        >
          All Notes ({notes.length})
        </button>
      </div>

      {activeTab === 'reports' ? (
        <section className="glass rounded-2xl border border-warm/25 p-6">
          <h2 className="text-lg font-semibold text-gray-900">Open reports</h2>
          <ul className="mt-4 space-y-3 text-sm">
            {reports.length === 0 ? <li className="text-muted">No reports — great job.</li> : null}
            {reports.map((r) => {
              const n = notes.find((x) => x.id === r.noteId || x._id === r.noteId)
              const noteTitle = n?.title || r.noteTitle || r.noteId
              const reporterName = r.userId?.name || r.byName || r.byUser || 'Unknown'
              return (
                <li key={r.id} className="rounded-xl border border-slate-600/30 bg-surface-1/60 p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-mono text-xs text-accent-2 font-bold uppercase">{r.reason}</p>
                      <p className="mt-1 text-gray-900 font-semibold">{noteTitle}</p>
                      <p className="text-sm text-gray-700 mt-1">{r.details || r.detail}</p>
                    </div>
                    <span className="text-[10px] text-muted bg-surface-2 px-2 py-1 rounded">
                      {new Date(r.createdAt || r.at).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="mt-3 flex items-center justify-between">
                    <p className="text-xs text-muted">
                      Reported by: <span className="text-gray-600">{reporterName}</span>
                    </p>
                    <div className="flex gap-2">
                      <Link
                        to={`/notes/${r.noteId}`}
                        className="rounded-lg border border-gray-300/40 px-3 py-1 text-xs font-semibold text-gray-700 hover:bg-surface-2"
                      >
                        View Note
                      </Link>
                      <button
                        type="button"
                        onClick={() => {
                          verifyNote(r.noteId)
                          showToast('Marked faculty-verified.', 'success')
                        }}
                        className="rounded-lg bg-accent px-3 py-1 text-xs font-bold text-white hover:brightness-110"
                      >
                        Verify note
                      </button>
                    </div>
                  </div>
                </li>
              )
            })}
          </ul>
        </section>
      ) : (
        <section className="glass rounded-2xl border border-warm/25 p-6">
          <h2 className="text-lg font-semibold text-gray-900">Content management</h2>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-gray-300/20 text-xs uppercase text-muted">
                <tr>
                  <th className="px-4 py-3 font-semibold">Title</th>
                  <th className="px-4 py-3 font-semibold">Subject</th>
                  <th className="px-4 py-3 font-semibold">Status</th>
                  <th className="px-4 py-3 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-300/10">
                {notes.map((n) => (
                  <tr key={n.id} className="hover:bg-surface-1/30">
                    <td className="px-4 py-3 font-medium text-gray-900">
                      <Link to={`/notes/${n.id}`} className="hover:text-accent">
                        {n.title}
                      </Link>
                    </td>
                    <td className="px-4 py-3 text-muted">{n.subjectCode}</td>
                    <td className="px-4 py-3">
                      {n.verifiedFaculty ? (
                        <span className="rounded-full bg-emerald-500/20 px-2 py-0.5 text-[10px] font-bold text-emerald-400">
                          VERIFIED
                        </span>
                      ) : (
                        <span className="rounded-full bg-amber-500/20 px-2 py-0.5 text-[10px] font-bold text-amber-400">
                          PENDING
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex justify-end gap-2">
                        {!n.verifiedFaculty && (
                          <button
                            onClick={() => {
                              verifyNote(n.id)
                              showToast('Note verified.', 'success')
                            }}
                            className="text-xs font-bold text-accent hover:underline"
                          >
                            Verify
                          </button>
                        )}
                        <button
                          onClick={() => {
                            if (window.confirm('Delete this note?')) {
                              deleteNote(n.id)
                              showToast('Note deleted.', 'success')
                            }
                          }}
                          className="text-xs font-bold text-danger hover:underline"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}
    </div>
  )
}

function StatCard({ label, value, color }) {
  return (
    <div className="rounded-xl border border-slate-600/30 bg-surface-1/60 p-3 text-center">
      <p className="text-[10px] font-semibold uppercase tracking-wider text-muted">{label}</p>
      <p className={`mt-1 text-lg font-bold ${color}`}>{value}</p>
    </div>
  )
}
