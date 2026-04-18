import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { NoteCard } from '../components/NoteCard'
import { useNotes } from '../context/NotesContext'

export function Bookmarks() {
  const { notes, bookmarks } = useNotes()
  const saved = useMemo(
    () => notes.filter((n) => bookmarks.has(n.id)).sort((a, b) => a.title.localeCompare(b.title)),
    [notes, bookmarks]
  )

  return (
    <div className="space-y-8">
      <header>
        <h1 className="font-display text-3xl font-bold text-gray-900 sm:text-4xl">Saved notes</h1>
        <p className="mt-2 text-muted">Bookmarks stay on this device until you connect a backend account.</p>
      </header>

      {saved.length === 0 ? (
        <div className="glass rounded-2xl border border-dashed border-gray-300/40 py-20 text-center">
          <p className="font-display text-lg text-gray-800">Nothing saved yet</p>
          <p className="mt-2 text-sm text-muted">Tap the star on any card while signed in.</p>
          <Link
            to="/browse"
            className="mt-6 inline-flex rounded-xl bg-accent px-5 py-2.5 text-sm font-bold text-white hover:brightness-110"
          >
            Browse notes
          </Link>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          {saved.map((note) => (
            <NoteCard key={note.id} note={note} />
          ))}
        </div>
      )}
    </div>
  )
}
