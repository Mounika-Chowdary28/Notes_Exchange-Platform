import { useAuth } from '../context/AuthContext'
import { useGamification } from '../context/GamificationContext'
import { useNotes } from '../context/NotesContext'
import { useToast } from '../context/ToastContext'

export function VoteControl({ noteId, className = '' }) {
  const { isAuthenticated } = useAuth()
  const { getNote, vote, score } = useNotes()
  const { showToast } = useToast()
  const { reward } = useGamification()
  const note = getNote(noteId)
  if (!note) return null
  const s = score(note)

  const onVote = async (type) => {
    if (!isAuthenticated) {
      showToast('Sign in to vote on notes.', 'info')
      return
    }
    const prev = s.userVote
    await vote(noteId, type)
    if (prev !== type) reward('vote')
  }

  return (
    <div className={`flex items-center gap-1 rounded-xl border border-slate-600/30 bg-surface-1/80 p-1 ${className}`}>
      <button
        type="button"
        onClick={() => onVote('up')}
        className={`focus-ring flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium transition hover:bg-surface-2 ${
          s.userVote === 'up' ? 'text-accent bg-surface-2' : 'text-slate-300'
        }`}
        aria-pressed={s.userVote === 'up'}
        aria-label="Upvote"
      >
        <span aria-hidden>▲</span>
        {s.up}
      </button>
      <span className="px-1 text-xs font-semibold text-muted" title="Net score · total votes">
        {s.net} <span className="text-[10px] opacity-80">({s.up + s.down})</span>
      </span>
      <button
        type="button"
        onClick={() => onVote('down')}
        className={`focus-ring flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium transition hover:bg-surface-2 ${
          s.userVote === 'down' ? 'text-danger bg-surface-2' : 'text-slate-300'
        }`}
        aria-pressed={s.userVote === 'down'}
        aria-label="Downvote"
      >
        <span aria-hidden>▼</span>
        {s.down}
      </button>
    </div>
  )
}
