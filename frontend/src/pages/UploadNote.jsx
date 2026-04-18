import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { FileDropzone } from '../components/FileDropzone'
import { BRANCHES, NOTE_TYPES, SEMESTERS } from '../data/mockData'
import { useAuth } from '../context/AuthContext'
import { useGamification } from '../context/GamificationContext'
import { useNotes } from '../context/NotesContext'
import { useToast } from '../context/ToastContext'
import { postNoteUpload } from '../services/noteService'

function detectFileType(file) {
  if (!file) return 'pdf'
  const n = file.name.toLowerCase()
  if (n.endsWith('.docx')) return 'docx'
  if (file.type.startsWith('image/')) return 'image'
  return 'pdf'
}

export function UploadNote() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const { addNote, checkDuplicateUpload } = useNotes()
  const { showToast } = useToast()
  const { reward } = useGamification()
  const [title, setTitle] = useState('')
  const [subject, setSubject] = useState('')
  const [subjectCode, setSubjectCode] = useState('')
  const [semester, setSemester] = useState('3')
  const [branch, setBranch] = useState('CSE')
  const [unit, setUnit] = useState('Unit 1')
  const [description, setDescription] = useState('')
  const [tags, setTags] = useState('')
  const [noteType, setNoteType] = useState('full_notes')
  const [difficulty, setDifficulty] = useState('medium')
  const [examFocused, setExamFocused] = useState(false)
  const [importantExam, setImportantExam] = useState(false)
  const [labViva, setLabViva] = useState(false)
  const [handwritten, setHandwritten] = useState(false)
  const [ocrIndexed, setOcrIndexed] = useState(false)
  const [queue, setQueue] = useState([])
  const [progress, setProgress] = useState({})
  const [submitting, setSubmitting] = useState(false)

  const onFiles = (f) => {
    setQueue((q) => [...q, f].slice(0, 8))
  }

  const removeAt = (i) => {
    setQueue((q) => q.filter((_, idx) => idx !== i))
  }

  const runUpload = async (e) => {
    e.preventDefault()
    if (!title.trim() || !subject.trim() || !subjectCode.trim()) {
      showToast('Fill title, subject, and subject code.', 'error')
      return
    }
    if (!queue.length) {
      showToast('Add at least one file.', 'error')
      return
    }
    const dup = checkDuplicateUpload({
      title,
      subjectCode,
      userId: user?.id,
      fileName: queue[0]?.name,
    })
    if (dup.duplicate) {
      const ok = window.confirm('Possible duplicate detected. Upload anyway?')
      if (!ok) return
    }

    setSubmitting(true)
    const tagList = tags
      .split(',')
      .map((t) => t.trim().toLowerCase())
      .filter(Boolean)

    try {
      for (let i = 0; i < queue.length; i += 1) {
        const file = queue[i]
        const id = `${i}-${file.name}`
        setProgress((p) => ({ ...p, [id]: 10 }))
        await new Promise((r) => setTimeout(r, 200 + i * 80))
        setProgress((p) => ({ ...p, [id]: 60 }))
        const fileType = detectFileType(file)
        const fileUrl = URL.createObjectURL(file)
        const fd = new FormData()
        fd.append('file', file)
        fd.append('title', `${title.trim()}${queue.length > 1 ? ` (${i + 1}/${queue.length})` : ''}`)
        await postNoteUpload(fd)
        setProgress((p) => ({ ...p, [id]: 100 }))
        const created = addNote({
          title: `${title.trim()}${queue.length > 1 ? ` (${i + 1}/${queue.length})` : ''}`,
          subject: subject.trim(),
          subjectCode: subjectCode.trim(),
          semester,
          branch,
          unit,
          description: description.trim(),
          tags: tagList,
          noteType,
          difficulty,
          examFocused,
          importantExam,
          labViva,
          handwritten,
          ocrIndexed: ocrIndexed || fileType === 'image',
          fileType,
          fileUrl,
          userId: user?.id || 'anon',
          userName: user?.name || 'Student',
        })
        reward('upload')
        if (queue.length === 1) navigate(`/notes/${created.id}`)
      }
      showToast(queue.length > 1 ? 'Bulk upload complete.' : 'Published!', 'success')
      if (queue.length > 1) navigate('/dashboard')
      setQueue([])
      setProgress({})
    } catch {
      showToast('Upload failed — try again.', 'error')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <div>
        <h1 className="font-display text-3xl font-bold text-slate-50 sm:text-4xl">Upload notes</h1>
        <p className="mt-2 text-muted">Multi-file queue, duplicate hints, DOCX/PDF/image, rich metadata, OCR flag.</p>
      </div>

      <form onSubmit={runUpload} className="glass space-y-8 rounded-3xl border border-slate-600/25 p-6 sm:p-8">
        <FileDropzone
          file={queue[queue.length - 1] || null}
          onFileChange={onFiles}
          error=""
        />
        {queue.length ? (
          <ul className="space-y-2 rounded-xl border border-slate-600/30 bg-surface-0/50 p-3 text-sm">
            {queue.map((f, i) => (
              <li key={`${f.name}-${i}`} className="flex items-center justify-between gap-2">
                <span className="truncate font-mono text-xs text-accent-2">{f.name}</span>
                <button type="button" onClick={() => removeAt(i)} className="text-xs text-warm hover:underline">
                  Remove
                </button>
                {progress[`${i}-${f.name}`] != null ? (
                  <span className="text-[10px] text-muted">{progress[`${i}-${f.name}`]}%</span>
                ) : null}
              </li>
            ))}
          </ul>
        ) : null}

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label className="text-sm font-medium text-gray-700">Title</label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="focus-ring mt-1.5 w-full rounded-xl border border-gray-300 bg-white/95 px-4 py-3 text-gray-900"
              placeholder="e.g. DBMS Unit 3 — Transactions"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700">Subject name</label>
            <input
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="focus-ring mt-1.5 w-full rounded-xl border border-gray-300 bg-white/95 px-4 py-3 text-gray-900"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700">Subject code</label>
            <input
              value={subjectCode}
              onChange={(e) => setSubjectCode(e.target.value.toUpperCase())}
              className="focus-ring mt-1.5 w-full rounded-xl border border-gray-300 bg-white/95 px-4 py-3 font-mono text-gray-900"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700">Unit / topic</label>
            <input
              value={unit}
              onChange={(e) => setUnit(e.target.value)}
              className="focus-ring mt-1.5 w-full rounded-xl border border-gray-300 bg-white/95 px-4 py-3 text-gray-900"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700">Semester</label>
            <select
              value={semester}
              onChange={(e) => setSemester(e.target.value)}
              className="focus-ring mt-1.5 w-full rounded-xl border border-gray-300 bg-white/95 px-4 py-3 text-sm text-gray-900"
            >
              {SEMESTERS.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700">Branch</label>
            <select
              value={branch}
              onChange={(e) => setBranch(e.target.value)}
              className="focus-ring mt-1.5 w-full rounded-xl border border-gray-300 bg-white/95 px-4 py-3 text-sm text-gray-900"
            >
              {BRANCHES.map((b) => (
                <option key={b} value={b}>
                  {b}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700">Category</label>
            <select
              value={noteType}
              onChange={(e) => setNoteType(e.target.value)}
              className="focus-ring mt-1.5 w-full rounded-xl border border-slate-600/40 bg-surface-0/90 px-4 py-3 text-sm"
            >
              {Object.entries(NOTE_TYPES).map(([k, v]) => (
                <option key={k} value={k}>
                  {v}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700">Difficulty</label>
            <select
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value)}
              className="focus-ring mt-1.5 w-full rounded-xl border border-slate-600/40 bg-surface-0/90 px-4 py-3 text-sm"
            >
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="advanced">Advanced</option>
            </select>
          </div>
          <div className="sm:col-span-2">
            <label className="text-sm font-medium text-gray-700">Tags (comma separated)</label>
            <input
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              className="focus-ring mt-1.5 w-full rounded-xl border border-gray-300 bg-white/95 px-4 py-3 text-gray-900"
              placeholder="pyq, revision, sql"
            />
          </div>
          <div className="sm:col-span-2 flex flex-wrap gap-4 text-sm text-gray-700">
            <label className="flex items-center gap-2">
              <input type="checkbox" checked={examFocused} onChange={(e) => setExamFocused(e.target.checked)} />
              Exam-focused
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" checked={importantExam} onChange={(e) => setImportantExam(e.target.checked)} />
              Important for exams
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" checked={labViva} onChange={(e) => setLabViva(e.target.checked)} />
              Lab / viva prep
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" checked={handwritten} onChange={(e) => setHandwritten(e.target.checked)} />
              Handwritten scan
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" checked={ocrIndexed} onChange={(e) => setOcrIndexed(e.target.checked)} />
              OCR indexed (demo flag)
            </label>
          </div>
          <div className="sm:col-span-2">
            <label className="text-sm font-medium text-gray-700">Description</label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="focus-ring mt-1.5 w-full rounded-xl border border-gray-300 bg-white/95 px-4 py-3 text-gray-900"
            />
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-600/20 pt-6">
          <Link to="/browse" className="text-sm text-muted hover:text-accent">
            Cancel
          </Link>
          <button
            type="submit"
            disabled={submitting}
            className="focus-ring rounded-2xl bg-accent px-8 py-3 text-sm font-bold text-white disabled:opacity-50"
          >
            {submitting ? 'Uploading…' : 'Publish queue'}
          </button>
        </div>
      </form>
    </div>
  )
}
