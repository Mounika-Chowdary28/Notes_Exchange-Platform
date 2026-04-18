import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { BookmarkButton } from '../components/BookmarkButton'
import { CommentThread } from '../components/CommentThread'
import { NoteBadges } from '../components/NoteBadges'
import { NoteCard } from '../components/NoteCard'
import { PreviewModal } from '../components/PreviewModal'
import { QualityBadge } from '../components/QualityBadge'
import { ReportModal } from '../components/ReportModal'
import { VoteControl } from '../components/VoteControl'
import { useAuth } from '../context/AuthContext'
import { useGamification } from '../context/GamificationContext'
import { useNotes } from '../context/NotesContext'
import { useToast } from '../context/ToastContext'

function canEmbed(url) {
  return typeof url === 'string' && (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('blob:'))
}

export function NoteDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user, isAuthenticated, isAdmin } = useAuth()
  const { reward } = useGamification()
  const { getNote, notes, score, bumpDownload, recordView, deleteNote } = useNotes()
  const { showToast } = useToast()
  const [previewOpen, setPreviewOpen] = useState(false)
  const [reportOpen, setReportOpen] = useState(false)
  const [ocrQ, setOcrQ] = useState('')
  const note = id ? getNote(id) : null

  useEffect(() => {
    if (note?.id) recordView(note.id)
  }, [note?.id, recordView])

  const related = useMemo(() => {
    if (!note) return []
    return notes
      .filter((n) => n.id !== note.id && (n.subjectCode === note.subjectCode || n.branch === note.branch))
      .slice(0, 3)
  }, [note, notes])

  const ocrHits = useMemo(() => {
    if (!note || !ocrQ.trim()) return []
    const t = ocrQ.toLowerCase()
    const pool = [note.title, note.description, note.subject, ...(note.tags || [])].join(' ').toLowerCase()
    return pool.includes(t) ? ['Title/metadata match', 'Tagged section', 'Simulated OCR chunk (demo)'] : []
  }, [note, ocrQ])

  if (!note) {
    return (
      <div className="glass rounded-2xl py-16 text-center">
        <p className="font-display text-xl text-gray-800">Note not found</p>
        <Link to="/browse" className="mt-4 inline-block text-accent hover:underline">
          ← Back to browse
        </Link>
      </div>
    )
  }

  const s = score(note)
  const previewPdf = note.fileType === 'pdf' && canEmbed(note.fileUrl)
  const isOwner = user?.id === note.uploadedBy?.id

  const onDownload = () => {
    bumpDownload(note.id, user?.id)
    reward('download')
    if (canEmbed(note.fileUrl)) {
      window.open(note.fileUrl, '_blank', 'noopener,noreferrer')
      showToast('Download / open started.', 'success')
      return
    }
    showToast('Demo file — download count updated. Connect API for real files.', 'info')
  }

  const onDelete = () => {
    if (!window.confirm('Delete this note permanently (demo removes from your catalog)?')) return
    deleteNote(note.id)
    showToast('Note removed.', 'success')
    navigate('/dashboard')
  }

  return (
    <div className="space-y-10">
      <PreviewModal open={previewOpen} onClose={() => setPreviewOpen(false)} note={note} fileUrl={note.fileUrl} />
      <ReportModal open={reportOpen} onClose={() => setReportOpen(false)} noteId={note.id} />

      <nav className="text-sm text-muted">
        <Link to="/browse" className="text-accent hover:underline">
          Browse
        </Link>
        <span className="mx-2">/</span>
        <span className="text-slate-400">{note.subjectCode}</span>
      </nav>

      <header className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-lg bg-surface-2 px-2 py-1 font-mono text-xs text-accent-2">{note.subjectCode}</span>
            <span className="text-sm text-muted">
              Semester {note.semester} · {note.branch}
            </span>
            <span className="rounded-lg bg-surface-2 px-2 py-1 text-[10px] uppercase text-muted">{note.unit}</span>
            <span
              className={`rounded-lg px-2 py-1 text-[10px] font-bold uppercase ${
                note.fileType === 'pdf' ? 'bg-rose-500/20 text-rose-200' : note.fileType === 'docx' ? 'bg-sky-500/20 text-sky-200' : 'bg-violet-500/20 text-violet-200'
              }`}
            >
              {note.fileType}
            </span>
            <span className="rounded-lg border border-accent/30 px-2 py-1 text-[10px] font-mono text-accent">
              {note.versionLabel || `v${note.version}`}
            </span>
          </div>
          <div className="mt-3">
            <NoteBadges note={note} />
          </div>
          <h1 className="mt-4 font-display text-3xl font-bold leading-tight text-slate-50 sm:text-4xl">{note.title}</h1>
          <p className="mt-2 text-lg text-muted">{note.subject}</p>
          {note.description ? <p className="mt-4 max-w-3xl text-gray-700">{note.description}</p> : null}
          <div className="mt-4 flex flex-wrap gap-3">
            <QualityBadge note={note} />
            <span className="text-sm text-muted">
              {s.up + s.down} total votes · {note.views ?? 0} views · {note.downloads} downloads
            </span>
          </div>
          <p className="mt-2 text-sm text-muted">
            Uploaded by <strong className="text-gray-700">{note.uploadedBy.name}</strong> ·{' '}
            {new Intl.DateTimeFormat(undefined, { dateStyle: 'long' }).format(new Date(note.createdAt))}
          </p>
          {(note.versions || []).length > 1 ? (
            <div className="mt-4 rounded-xl border border-slate-600/30 bg-surface-1/60 p-3 text-sm text-muted">
              <p className="font-semibold text-gray-800">Version history</p>
              <ul className="mt-2 list-inside list-disc text-xs">
                {(note.versions || []).map((v) => (
                  <li key={v.v}>
                    {v.label} · {new Date(v.at).toLocaleDateString()}
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </div>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center lg:flex-col lg:items-stretch">
          <VoteControl noteId={note.id} />
          <div className="flex flex-wrap gap-2">
            <BookmarkButton noteId={note.id} />
            <button
              type="button"
              onClick={() => setPreviewOpen(true)}
              className="focus-ring rounded-xl border border-accent-2/40 bg-accent-2/10 px-4 py-2 text-sm font-semibold text-accent-2 hover:bg-accent-2/20"
            >
              Quick preview
            </button>
            <button
              type="button"
              onClick={onDownload}
              className="focus-ring inline-flex items-center justify-center rounded-xl bg-accent px-5 py-2 text-sm font-bold text-white hover:brightness-110"
            >
              Download
            </button>
            {isAuthenticated ? (
              <button
                type="button"
                onClick={() => setReportOpen(true)}
                className="rounded-xl border border-gray-300/45 px-4 py-2 text-sm text-gray-700 hover:bg-surface-2"
              >
                Report
              </button>
            ) : null}
            {isOwner || isAdmin ? (
              <Link
                to={`/notes/${note.id}/edit`}
                className="rounded-xl border border-gray-300/45 px-4 py-2 text-center text-sm text-gray-800 hover:bg-surface-2"
              >
                Edit
              </Link>
            ) : null}
            {isOwner || isAdmin ? (
              <button type="button" onClick={onDelete} className="rounded-xl border border-danger/40 px-4 py-2 text-sm text-danger hover:bg-danger/10">
                Delete
              </button>
            ) : null}
            {!isAuthenticated ? (
              <button
                type="button"
                onClick={() => navigate('/auth', { state: { from: `/notes/${note.id}` } })}
                className="focus-ring rounded-xl border border-gray-300/50 px-4 py-2 text-sm text-gray-800 hover:bg-surface-2"
              >
                Sign in to vote
              </button>
            ) : null}
          </div>
        </div>
      </header>

      {note.ocrIndexed ? (
        <section className="glass rounded-2xl border border-accent-2/25 p-5">
          <h2 className="font-display text-lg font-semibold text-gray-900">Simulated OCR / in-document search</h2>
          <p className="mt-1 text-xs text-muted">
            Demo highlights matches in title, tags, and description. Wire Tesseract or server OCR for real scans.
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            <input
              value={ocrQ}
              onChange={(e) => setOcrQ(e.target.value)}
              placeholder="Search keywords inside note…"
              className="focus-ring min-w-[200px] flex-1 rounded-xl border border-slate-600/40 bg-surface-0/80 px-3 py-2 text-sm"
            />
          </div>
          {ocrHits.length ? (
            <ul className="mt-3 text-sm text-accent-2">
              {ocrHits.map((h) => (
                <li key={h}>• {h}</li>
              ))}
            </ul>
          ) : ocrQ.trim() ? (
            <p className="mt-3 text-sm text-muted">No simulated OCR hits — try words from the title or tags.</p>
          ) : null}
        </section>
      ) : null}

      <section className="glass overflow-hidden rounded-2xl border border-slate-600/20">
        <div className="border-b border-slate-600/20 px-5 py-3">
          <h2 className="font-display text-lg font-semibold text-gray-900">Inline preview</h2>
          <p className="text-xs text-muted">Open quick preview for zoom / fullscreen controls.</p>
        </div>
        <div className="min-h-[380px] bg-surface-0/50">
          {previewPdf && canEmbed(note.fileUrl) ? (
            <iframe title="PDF preview" src={note.fileUrl} className="h-[65vh] w-full border-0" />
          ) : note.fileType === 'image' && canEmbed(note.fileUrl) ? (
            <img src={note.fileUrl} alt="" className="mx-auto max-h-[65vh] w-auto object-contain p-4" />
          ) : (
            <div className="flex flex-col items-center justify-center gap-4 py-16 text-center">
              <div className="animate-float text-5xl opacity-80" aria-hidden>
                {note.fileType === 'pdf' ? '📄' : note.fileType === 'docx' ? '📝' : '🖼️'}
              </div>
              <p className="max-w-md text-sm text-muted">
                Uploads receive a temporary blob URL for instant preview. Demo seeds use placeholders.
              </p>
              <button
                type="button"
                onClick={() => setPreviewOpen(true)}
                className="rounded-xl border border-accent/40 px-4 py-2 text-sm font-semibold text-accent hover:bg-accent/10"
              >
                Open quick preview UI
              </button>
            </div>
          )}
        </div>
      </section>

      <div className="grid gap-10 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <CommentThread note={note} />
        </div>
        <aside className="space-y-4">
          <div className="glass rounded-2xl border border-slate-600/20 p-5">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-muted">Sort / quality</h3>
            <p className="mt-2 text-sm text-slate-400">
              Notes are ranked by composite quality score in Browse → sort “Quality score”.
            </p>
          </div>
          <div className="glass rounded-2xl border border-slate-600/20 p-5">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-muted">Tags</h3>
            <div className="mt-2 flex flex-wrap gap-2">
              {(note.tags || []).map((t) => (
                <span key={t} className="rounded-md bg-surface-2 px-2 py-1 font-mono text-xs text-accent-2">
                  #{t}
                </span>
              ))}
            </div>
          </div>
        </aside>
      </div>

      {related.length > 0 ? (
        <section>
          <h2 className="font-display text-2xl font-bold text-slate-50">Related picks</h2>
          <p className="mt-1 text-sm text-muted">Same subject code or branch.</p>
          <div className="mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {related.map((n) => (
              <NoteCard key={n.id} note={n} />
            ))}
          </div>
        </section>
      ) : null}
    </div>
  )
}
