import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { BRANCHES, NOTE_TYPES, SEMESTERS } from '../data/mockData'
import { useAuth } from '../context/AuthContext'
import { useNotes } from '../context/NotesContext'
import { useToast } from '../context/ToastContext'

function EditNoteForm({ note }) {
  const navigate = useNavigate()
  const { editNote } = useNotes()
  const { showToast } = useToast()
  const [title, setTitle] = useState(note.title)
  const [subject, setSubject] = useState(note.subject)
  const [subjectCode, setSubjectCode] = useState(note.subjectCode)
  const [semester, setSemester] = useState(String(note.semester))
  const [branch, setBranch] = useState(note.branch)
  const [unit, setUnit] = useState(note.unit || '')
  const [description, setDescription] = useState(note.description || '')
  const [tags, setTags] = useState((note.tags || []).join(', '))
  const [noteType, setNoteType] = useState(note.noteType || 'full_notes')

  const save = (e) => {
    e.preventDefault()
    const tagList = tags
      .split(',')
      .map((t) => t.trim().toLowerCase())
      .filter(Boolean)
    editNote(
      note.id,
      {
        title: title.trim(),
        subject: subject.trim(),
        subjectCode: subjectCode.trim().toUpperCase(),
        semester: Number(semester),
        branch,
        unit: unit.trim(),
        description: description.trim(),
        tags: tagList,
        noteType,
      },
      String(note.id).startsWith('local-')
    )
    showToast('Note updated (demo patch).', 'success')
    navigate(`/notes/${note.id}`)
  }

  return (
    <form onSubmit={save} className="glass space-y-4 rounded-2xl border border-slate-600/25 p-6">
      <input value={title} onChange={(e) => setTitle(e.target.value)} className="w-full rounded-xl border border-slate-600/40 bg-surface-0/90 px-3 py-2 text-sm" />
      <input value={subject} onChange={(e) => setSubject(e.target.value)} className="w-full rounded-xl border border-slate-600/40 bg-surface-0/90 px-3 py-2 text-sm" />
      <input value={subjectCode} onChange={(e) => setSubjectCode(e.target.value.toUpperCase())} className="w-full rounded-xl border border-slate-600/40 bg-surface-0/90 px-3 py-2 font-mono text-sm" />
      <div className="grid grid-cols-2 gap-3">
        <select value={semester} onChange={(e) => setSemester(e.target.value)} className="rounded-xl border border-slate-600/40 bg-surface-0/90 px-3 py-2 text-sm">
          {SEMESTERS.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
        <select value={branch} onChange={(e) => setBranch(e.target.value)} className="rounded-xl border border-slate-600/40 bg-surface-0/90 px-3 py-2 text-sm">
          {BRANCHES.map((b) => (
            <option key={b} value={b}>
              {b}
            </option>
          ))}
        </select>
      </div>
      <input value={unit} onChange={(e) => setUnit(e.target.value)} placeholder="Unit" className="w-full rounded-xl border border-slate-600/40 bg-surface-0/90 px-3 py-2 text-sm" />
      <select value={noteType} onChange={(e) => setNoteType(e.target.value)} className="w-full rounded-xl border border-slate-600/40 bg-surface-0/90 px-3 py-2 text-sm">
        {Object.entries(NOTE_TYPES).map(([k, v]) => (
          <option key={k} value={k}>
            {v}
          </option>
        ))}
      </select>
      <textarea rows={3} value={description} onChange={(e) => setDescription(e.target.value)} className="w-full rounded-xl border border-slate-600/40 bg-surface-0/90 px-3 py-2 text-sm" />
      <input value={tags} onChange={(e) => setTags(e.target.value)} placeholder="tags" className="w-full rounded-xl border border-slate-600/40 bg-surface-0/90 px-3 py-2 text-sm" />
      <div className="flex gap-2">
        <button type="submit" className="rounded-xl bg-accent px-4 py-2 text-sm font-bold text-white">
          Save
        </button>
        <Link to={`/notes/${note.id}`} className="rounded-xl border border-slate-600/40 px-4 py-2 text-sm">
          Cancel
        </Link>
      </div>
      <p className="text-xs text-muted">Metadata patch only — file versioning belongs in API layer.</p>
    </form>
  )
}

export function EditNote() {
  const { id } = useParams()
  const { user, isAdmin } = useAuth()
  const { getNote } = useNotes()
  const note = id ? getNote(id) : null

  if (!note) {
    return (
      <p className="text-center text-muted">
        Not found. <Link to="/browse">Browse</Link>
      </p>
    )
  }

  if (user?.id !== note.uploadedBy?.id && !isAdmin) {
    return <p className="text-center text-warm">You can only edit your own notes.</p>
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <h1 className="font-display text-3xl font-bold text-slate-50">Edit note</h1>
      <EditNoteForm key={note.id} note={note} />
    </div>
  )
}
