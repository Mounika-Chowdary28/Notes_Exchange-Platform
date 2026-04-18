import { Link } from 'react-router-dom'
import { useNotes } from '../context/NotesContext'
import { VoteControl } from './VoteControl'
import { BookmarkButton } from './BookmarkButton'
import { NoteBadges } from './NoteBadges'
import { QualityBadge } from './QualityBadge'

function FileBadge({ type }) {
  const cls =
    type === 'pdf'
      ? 'bg-rose-400/30 text-rose-700'
      : type === 'docx'
        ? 'bg-sky-400/30 text-sky-700'
        : 'bg-accent/30 text-accent'
  const label = type === 'docx' ? 'DOCX' : type === 'pdf' ? 'PDF' : 'IMG'
  return (
    <span className={`rounded-md px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${cls}`}>{label}</span>
  )
}

export function NoteCard({ note }) {
  const { score } = useNotes()
  const s = score(note)

  return (
    <article className="group glass relative flex flex-col overflow-hidden rounded-2xl transition hover:border-accent/30 hover:shadow-lg hover:shadow-accent/10">
      <div className="absolute inset-0 bg-gradient-to-br from-accent/5 via-transparent to-calm/5 opacity-0 transition group-hover:opacity-100" />
      <div className="relative flex flex-1 flex-col p-5">
        <div className="mb-3 flex flex-wrap items-center gap-2">
          <FileBadge type={note.fileType} />
          <span className="rounded-md bg-surface-2 px-2 py-0.5 font-mono text-[11px] text-calm">{note.subjectCode}</span>
          <span className="text-[11px] text-muted">
            Sem {note.semester} · {note.branch}
          </span>
          {note.unit ? (
            <span className="text-[10px] text-muted" title="Unit / topic">
              {note.unit}
            </span>
          ) : null}
        </div>
        <div className="mb-2">
          <NoteBadges note={note} compact />
        </div>
        <Link to={`/notes/${note.id}`} className="focus-ring rounded-lg outline-offset-2">
          <h3 className="font-display text-lg font-semibold leading-snug text-gray-900 transition group-hover:text-accent">
            {note.title}
          </h3>
        </Link>
        <p className="mt-1 text-sm text-muted">{note.subject}</p>
        {(note.tags || []).length ? (
          <p className="mt-2 text-[11px] text-gray-600">
            {(note.tags || []).slice(0, 4).map((t) => (
              <span key={t} className="mr-2 rounded bg-surface-2/80 px-1.5 py-0.5 font-mono text-accent/90">
                #{t}
              </span>
            ))}
          </p>
        ) : null}
        {note.description ? (
          <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-gray-600">{note.description}</p>
        ) : null}
        <div className="mt-3">
          <QualityBadge note={note} />
        </div>
        <div className="mt-auto flex flex-wrap items-center gap-3 pt-4 text-xs text-muted">
          <span title="Votes">
            {s.up + s.down} votes · net {s.net > 0 ? `+${s.net}` : s.net}
          </span>
          <span>·</span>
          <span>{note.downloads} downloads</span>
          <span>·</span>
          <span>{note.views ?? 0} views</span>
          <span>·</span>
          <span className="truncate">by {note.uploadedBy.name}</span>
        </div>
        <div className="relative mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-gray-300/20 pt-4">
          <VoteControl noteId={note.id} />
          <div className="flex gap-2">
            <BookmarkButton noteId={note.id} />
            <Link
              to={`/notes/${note.id}`}
              className="focus-ring inline-flex items-center rounded-xl border border-accent/40 bg-accent/10 px-3 py-2 text-sm font-semibold text-accent transition hover:bg-accent/20"
            >
              Open
            </Link>
          </div>
        </div>
      </div>
    </article>
  )
}
