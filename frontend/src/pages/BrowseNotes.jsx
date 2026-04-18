import { useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { NoteCard } from '../components/NoteCard'
import { SearchField } from '../components/SearchField'
import { BRANCHES, NOTE_TYPES, SEMESTERS } from '../data/mockData'
import { useNotes } from '../context/NotesContext'
import { useToast } from '../context/ToastContext'
import { filterAndSortNotes } from '../utils/noteFilters'

export function BrowseNotes() {
  const { notes, score } = useNotes()
  const { showToast } = useToast()
  const [searchParams, setSearchParams] = useSearchParams()

  const [q, setQ] = useState(searchParams.get('q') || '')
  const [subjectCode, setSubjectCode] = useState(searchParams.get('code') || '')
  const [subjectName, setSubjectName] = useState(searchParams.get('subj') || '')
  const [tags, setTags] = useState(searchParams.get('tags') || '')
  const [semester, setSemester] = useState(searchParams.get('sem') || '')
  const [branch, setBranch] = useState(searchParams.get('branch') || '')
  const [unit, setUnit] = useState(searchParams.get('unit') || '')
  const [fileType, setFileType] = useState(searchParams.get('ft') || '')
  const [noteType, setNoteType] = useState(searchParams.get('nt') || '')
  const [difficulty, setDifficulty] = useState(searchParams.get('diff') || '')
  const [source, setSource] = useState(searchParams.get('src') || '')
  const [verifiedOnly, setVerifiedOnly] = useState(searchParams.get('ver') === '1')
  const [examOnly, setExamOnly] = useState(searchParams.get('exam') === '1')
  const [pyqOnly, setPyqOnly] = useState(searchParams.get('pyq') === '1')
  const [sort, setSort] = useState(searchParams.get('sort') || 'top')
  const [advancedOpen, setAdvancedOpen] = useState(true)

  const subjectOptions = useMemo(() => {
    const s = new Set(notes.map((n) => n.subject))
    return [...s].sort()
  }, [notes])

  const filtered = useMemo(
    () =>
      filterAndSortNotes(notes, {
        q,
        subjectCode,
        subject: subjectName,
        tags,
        semester,
        branch,
        unit,
        fileType,
        noteType,
        difficulty,
        source,
        verifiedOnly,
        examOnly,
        pyqOnly,
        sort,
      }, score),
    [
      notes,
      q,
      subjectCode,
      subjectName,
      tags,
      semester,
      branch,
      unit,
      fileType,
      noteType,
      difficulty,
      source,
      verifiedOnly,
      examOnly,
      pyqOnly,
      sort,
      score,
    ]
  )

  const buildParams = () => {
    const p = new URLSearchParams()
    if (q) p.set('q', q)
    if (subjectCode) p.set('code', subjectCode)
    if (subjectName) p.set('subj', subjectName)
    if (tags) p.set('tags', tags)
    if (semester) p.set('sem', semester)
    if (branch) p.set('branch', branch)
    if (unit) p.set('unit', unit)
    if (fileType) p.set('ft', fileType)
    if (noteType) p.set('nt', noteType)
    if (difficulty) p.set('diff', difficulty)
    if (source) p.set('src', source)
    if (verifiedOnly) p.set('ver', '1')
    if (examOnly) p.set('exam', '1')
    if (pyqOnly) p.set('pyq', '1')
    if (sort && sort !== 'top') p.set('sort', sort)
    return p
  }

  const copyShareLink = async () => {
    const p = buildParams()
    setSearchParams(p, { replace: true })
    const qs = p.toString()
    const url = `${window.location.origin}${window.location.pathname}${qs ? `?${qs}` : ''}`
    try {
      await navigator.clipboard.writeText(url)
      showToast('Advanced search link copied.', 'success')
    } catch {
      showToast('Clipboard blocked.', 'error')
    }
  }

  return (
    <div className="space-y-8">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold text-slate-50 sm:text-4xl">Browse notes</h1>
          <p className="mt-2 max-w-2xl text-muted">
            Subject code, name, tags, semester, branch, unit, file type, difficulty, and certification filters — plus quality-aware sorting.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setAdvancedOpen((o) => !o)}
          className="rounded-xl border border-accent/35 bg-accent/10 px-4 py-2 text-sm font-semibold text-accent hover:bg-accent/20"
        >
          {advancedOpen ? 'Hide advanced' : 'Advanced search'}
        </button>
      </header>

      <SearchField value={q} onChange={setQ} />

      <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
        <aside className={`glass w-full shrink-0 rounded-2xl border border-slate-600/20 p-5 lg:max-w-sm ${advancedOpen ? '' : 'hidden lg:block'}`}>
          <h2 className="text-sm font-semibold uppercase tracking-wider text-muted">Advanced panel</h2>
          <div className="mt-4 max-h-[70vh] space-y-4 overflow-y-auto pr-1">
            <div>
              <label className="text-xs font-medium text-slate-400">Semester</label>
              <select
                value={semester}
                onChange={(e) => setSemester(e.target.value)}
                className="focus-ring mt-1 w-full rounded-xl border border-slate-600/40 bg-surface-0/90 px-3 py-2.5 text-sm"
              >
                <option value="">All</option>
                {SEMESTERS.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs font-medium text-slate-400">Branch</label>
              <select
                value={branch}
                onChange={(e) => setBranch(e.target.value)}
                className="focus-ring mt-1 w-full rounded-xl border border-slate-600/40 bg-surface-0/90 px-3 py-2.5 text-sm"
              >
                <option value="">All</option>
                {BRANCHES.map((b) => (
                  <option key={b} value={b}>
                    {b}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs font-medium text-slate-400">Subject name</label>
              <select
                value={subjectName}
                onChange={(e) => setSubjectName(e.target.value)}
                className="focus-ring mt-1 w-full rounded-xl border border-slate-600/40 bg-surface-0/90 px-3 py-2.5 text-sm"
              >
                <option value="">All subjects</option>
                {subjectOptions.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs font-medium text-slate-400">Subject code</label>
              <input
                value={subjectCode}
                onChange={(e) => setSubjectCode(e.target.value.toUpperCase())}
                className="focus-ring mt-1 w-full rounded-xl border border-slate-600/40 bg-surface-0/90 px-3 py-2.5 font-mono text-sm"
                placeholder="CS302"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-slate-400">Unit / topic contains</label>
              <input
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
                className="focus-ring mt-1 w-full rounded-xl border border-slate-600/40 bg-surface-0/90 px-3 py-2.5 text-sm"
                placeholder="Unit 3"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-slate-400">Tags / keywords</label>
              <input
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                className="focus-ring mt-1 w-full rounded-xl border border-slate-600/40 bg-surface-0/90 px-3 py-2.5 text-sm"
                placeholder="comma separated: pyq, sql"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-slate-400">File type</label>
              <select
                value={fileType}
                onChange={(e) => setFileType(e.target.value)}
                className="focus-ring mt-1 w-full rounded-xl border border-slate-600/40 bg-surface-0/90 px-3 py-2.5 text-sm"
              >
                <option value="">Any</option>
                <option value="pdf">PDF</option>
                <option value="image">Image</option>
                <option value="docx">DOCX</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-medium text-slate-400">Note category</label>
              <select
                value={noteType}
                onChange={(e) => setNoteType(e.target.value)}
                className="focus-ring mt-1 w-full rounded-xl border border-slate-600/40 bg-surface-0/90 px-3 py-2.5 text-sm"
              >
                <option value="">Any</option>
                {Object.entries(NOTE_TYPES).map(([k, v]) => (
                  <option key={k} value={k}>
                    {v}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs font-medium text-slate-400">Difficulty</label>
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value)}
                className="focus-ring mt-1 w-full rounded-xl border border-slate-600/40 bg-surface-0/90 px-3 py-2.5 text-sm"
              >
                <option value="">Any</option>
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="advanced">Advanced</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-medium text-slate-400">Source</label>
              <select
                value={source}
                onChange={(e) => setSource(e.target.value)}
                className="focus-ring mt-1 w-full rounded-xl border border-slate-600/40 bg-surface-0/90 px-3 py-2.5 text-sm"
              >
                <option value="">Any</option>
                <option value="student">Student</option>
                <option value="faculty">Faculty</option>
              </select>
            </div>
            <label className="flex items-center gap-2 text-sm text-gray-700">
              <input type="checkbox" checked={verifiedOnly} onChange={(e) => setVerifiedOnly(e.target.checked)} />
              Faculty verified only
            </label>
            <label className="flex items-center gap-2 text-sm text-gray-700">
              <input type="checkbox" checked={examOnly} onChange={(e) => setExamOnly(e.target.checked)} />
              Exam-focused
            </label>
            <label className="flex items-center gap-2 text-sm text-gray-700">
              <input type="checkbox" checked={pyqOnly} onChange={(e) => setPyqOnly(e.target.checked)} />
              PYQ / papers only
            </label>
            <div>
              <label className="text-xs font-medium text-slate-400">Sort</label>
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="focus-ring mt-1 w-full rounded-xl border border-slate-600/40 bg-surface-0/90 px-3 py-2.5 text-sm"
              >
                <option value="top">Most upvoted (net)</option>
                <option value="quality">Quality score blend</option>
                <option value="new">Most recent</option>
                <option value="downloads">Most downloaded</option>
                <option value="views">Most viewed</option>
              </select>
            </div>
            <button
              type="button"
              onClick={copyShareLink}
              className="focus-ring w-full rounded-xl border border-accent/40 bg-accent/10 py-2.5 text-sm font-semibold text-accent hover:bg-accent/20"
            >
              Copy shareable link
            </button>
          </div>
        </aside>

        <div className="min-w-0 flex-1 space-y-4">
          <p className="text-sm text-muted">
            Showing <strong className="text-gray-800">{filtered.length}</strong> of {notes.length}
          </p>
          {filtered.length === 0 ? (
            <div className="glass rounded-2xl border border-dashed border-slate-600/40 py-16 text-center">
              <p className="font-display text-lg text-gray-800">No notes match</p>
              <p className="mt-2 text-sm text-muted">Relax filters or clear PYQ-only toggles.</p>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2">
              {filtered.map((note) => (
                <NoteCard key={note.id} note={note} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
