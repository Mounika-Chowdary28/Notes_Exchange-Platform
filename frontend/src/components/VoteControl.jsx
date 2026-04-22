import { ThumbsUp, ThumbsDown } from 'lucide-react'
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
    <div className={`flex items-center gap-1 rounded-xl bg-slate-50 p-1 border border-slate-200 ${className}`}>
      <button
        type="button"
        onClick={() => onVote('up')}
        className={`group/up flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-black transition-all ${
          s.userVote === 'up' 
            ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20' 
            : 'text-slate-400 hover:bg-white hover:text-emerald-500'
        }`}
        aria-pressed={s.userVote === 'up'}
        aria-label="Upvote"
      >
        <ThumbsUp className={`h-3.5 w-3.5 transition-transform group-hover/up:scale-110 ${s.userVote === 'up' ? 'fill-current' : ''}`} />
        {s.up}
      </button>

      <div className="h-4 w-[1px] bg-slate-200 mx-1" />

      <button
        type="button"
        onClick={() => onVote('down')}
        className={`group/down flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-black transition-all ${
          s.userVote === 'down' 
            ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/20' 
            : 'text-slate-400 hover:bg-white hover:text-rose-500'
        }`}
        aria-pressed={s.userVote === 'down'}
        aria-label="Downvote"
      >
        <ThumbsDown className={`h-3.5 w-3.5 transition-transform group-hover/down:scale-110 ${s.userVote === 'down' ? 'fill-current' : ''}`} />
        {s.down}
      </button>
    </div>
  )
}
