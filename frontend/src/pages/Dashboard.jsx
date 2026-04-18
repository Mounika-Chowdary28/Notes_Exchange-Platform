import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { NoteCard } from '../components/NoteCard'
import { useAuth } from '../context/AuthContext'
import { useGamification } from '../context/GamificationContext'
import { useNotes } from '../context/NotesContext'

export function Dashboard() {
  const { user, updateProfile } = useAuth()
  const { notes, bookmarks, downloadLog, recentViews, getNote } = useNotes()
  const { points, badges, badgeMeta, uploadsByMe } = useGamification()

  const mine = useMemo(() => notes.filter((n) => n.uploadedBy?.id === user?.id), [notes, user?.id])
  const saved = useMemo(() => notes.filter((n) => bookmarks.has(n.id)), [notes, bookmarks])
  const recent = useMemo(
    () => recentViews.map((id) => getNote(id)).filter(Boolean).slice(0, 6),
    [recentViews, getNote]
  )
  const myDownloads = useMemo(
    () => downloadLog.filter((d) => d.userId === user?.id).slice(0, 8),
    [downloadLog, user?.id]
  )

  return (
    <div className="space-y-10">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold text-gray-900">Student dashboard</h1>
          <p className="mt-2 text-muted">Uploads, downloads, saved notes, recents, stats, reputation.</p>
        </div>
        <Link to="/upload" className="rounded-2xl bg-accent px-5 py-2.5 text-sm font-bold text-white">
          New upload
        </Link>
      </header>

      <section className="grid gap-4 md:grid-cols-3">
        <div className="glass rounded-2xl border border-accent/25 p-5">
          <p className="text-xs uppercase text-muted">Reputation score</p>
          <p className="mt-2 font-display text-3xl font-bold text-accent">{points}</p>
          <p className="text-xs text-muted">Points + upload weighting</p>
        </div>
        <div className="glass rounded-2xl border border-accent-2/25 p-5">
          <p className="text-xs uppercase text-muted">Contributions</p>
          <p className="mt-2 font-display text-3xl font-bold text-accent-2">{uploadsByMe}</p>
          <p className="text-xs text-muted">Notes you published</p>
        </div>
        <div className="glass rounded-2xl border border-warm/25 p-5">
          <p className="text-xs uppercase text-muted">Saved</p>
          <p className="mt-2 font-display text-3xl font-bold text-warm">{saved.length}</p>
          <p className="text-xs text-muted">Bookmarked notes</p>
        </div>
      </section>

      <section className="glass rounded-2xl border border-slate-600/25 p-6">
        <h2 className="font-display text-xl font-semibold text-gray-900">Profile (for recommendations)</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <label className="text-sm text-muted">
            Branch
            <select
              defaultValue={user?.branch}
              onChange={(e) => updateProfile({ branch: e.target.value })}
              className="focus-ring mt-1 w-full rounded-xl border border-gray-300 bg-white/95 px-3 py-2 text-sm text-gray-900"
            >
              {['CSE', 'ECE', 'ME', 'CE', 'EEE', 'IT'].map((b) => (
                <option key={b} value={b}>
                  {b}
                </option>
              ))}
            </select>
          </label>
          <label className="text-sm text-muted">
            Semester
            <select
              defaultValue={user?.semester}
              onChange={(e) => updateProfile({ semester: Number(e.target.value) })}
              className="focus-ring mt-1 w-full rounded-xl border border-gray-300 bg-white/95 px-3 py-2 text-sm text-gray-900"
            >
              {[1, 2, 3, 4, 5, 6, 7, 8].map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </label>
        </div>
      </section>

      <section>
        <h2 className="font-display text-xl font-semibold text-gray-900">Badges</h2>
        <div className="mt-3 flex flex-wrap gap-2">
          {badges.length === 0 ? <p className="text-sm text-muted">Upload and engage to unlock.</p> : null}
          {badges.map((b) => (
            <span
              key={b}
              title={badgeMeta[b]?.label}
              className="rounded-xl border border-gold/30 bg-gold/10 px-3 py-1 text-sm text-gold"
            >
              {badgeMeta[b]?.icon} {badgeMeta[b]?.label || b}
            </span>
          ))}
        </div>
      </section>

      <section>
        <h2 className="font-display text-xl font-semibold text-gray-900">My uploads</h2>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          {mine.length === 0 ? <p className="text-sm text-muted">Nothing yet — share your first note.</p> : null}
          {mine.map((n) => (
            <NoteCard key={n.id} note={n} />
          ))}
        </div>
      </section>

      <section>
        <h2 className="font-display text-xl font-semibold text-gray-900">Recently viewed</h2>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          {recent.map((n) => (
            <NoteCard key={n.id} note={n} />
          ))}
        </div>
      </section>

      <section>
        <h2 className="font-display text-xl font-semibold text-gray-900">My downloads (logged)</h2>
        <ul className="mt-3 space-y-2 text-sm text-muted">
          {myDownloads.length === 0 ? <li>No downloads logged while signed in.</li> : null}
          {myDownloads.map((d) => {
            const n = getNote(d.noteId)
            return (
              <li key={`${d.at}-${d.noteId}`}>
                {n ? <Link className="text-accent hover:underline" to={`/notes/${n.id}`}>{n.title}</Link> : d.noteId} ·{' '}
                {new Date(d.at).toLocaleString()}
              </li>
            )
          })}
        </ul>
      </section>
    </div>
  )
}
