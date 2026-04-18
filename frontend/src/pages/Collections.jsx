import { useState } from 'react'
import { NoteCard } from '../components/NoteCard'
import { useNotes } from '../context/NotesContext'
import { useToast } from '../context/ToastContext'

export function Collections() {
  const { collections, addCollection, toggleNoteInCollection, notes } = useNotes()
  const { showToast } = useToast()
  const [name, setName] = useState('Exam Week')
  const [pickCol, setPickCol] = useState('')
  const [pickNote, setPickNote] = useState(notes[0]?.id || '')
  const activeColId = pickCol || collections[0]?.id || ''

  const create = () => {
    const c = addCollection(name)
    setPickCol(c.id)
    showToast('Collection created.', 'success')
    setName('Exam Week')
  }

  const col = collections.find((c) => c.id === activeColId)
  const colNotes = (col?.noteIds || []).map((id) => notes.find((n) => n.id === id)).filter(Boolean)

  return (
    <div className="space-y-8">
      <header>
        <h1 className="font-display text-3xl font-bold text-slate-50">Collections</h1>
        <p className="mt-2 text-muted">Curate sets like “Exam Week”, “DBMS Important”, or “Placement prep”.</p>
      </header>
      <div className="glass flex flex-wrap items-end gap-3 rounded-2xl border border-slate-600/25 p-5">
        <label className="text-sm text-muted">
          Name
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="focus-ring mt-1 block rounded-xl border border-slate-600/40 bg-surface-0/90 px-3 py-2 text-sm"
            placeholder="Exam Week"
          />
        </label>
        <button type="button" onClick={create} className="rounded-xl bg-accent px-4 py-2 text-sm font-bold text-white">
          Create
        </button>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <label className="text-sm text-muted">
          Active collection
          <select
            value={activeColId}
            onChange={(e) => setPickCol(e.target.value)}
            className="focus-ring mt-1 w-full rounded-xl border border-slate-600/40 bg-surface-0/90 px-3 py-2 text-sm"
          >
            {collections.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </label>
        <label className="text-sm text-muted">
          Add note
          <select
            value={pickNote}
            onChange={(e) => setPickNote(e.target.value)}
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
      <button
        type="button"
        onClick={() => {
          if (!activeColId || !pickNote) return
          toggleNoteInCollection(activeColId, pickNote)
          showToast('Collection updated.', 'success')
        }}
        className="rounded-xl border border-accent-2/40 px-4 py-2 text-sm text-accent-2"
      >
        Toggle selected note in collection
      </button>
      <section>
        <h2 className="font-display text-xl font-semibold text-gray-900">{col?.name || 'Pick a collection'}</h2>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          {colNotes.length === 0 ? <p className="text-sm text-muted">Empty — add notes above.</p> : null}
          {colNotes.map((n) => (
            <NoteCard key={n.id} note={n} />
          ))}
        </div>
      </section>
    </div>
  )
}
