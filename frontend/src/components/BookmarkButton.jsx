import { Star } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useNotes } from '../context/NotesContext'
import { useToast } from '../context/ToastContext'

export function BookmarkButton({ noteId, className = '' }) {
  const { isAuthenticated } = useAuth()
  const { isBookmarked, toggleBookmark } = useNotes()
  const { showToast } = useToast()
  const on = isBookmarked(noteId)

  const handle = () => {
    if (!isAuthenticated) {
      showToast('Sign in to save bookmarks.', 'info')
      return
    }
    toggleBookmark(noteId)
    showToast(on ? 'Removed from saved.' : 'Saved to your list.', 'success')
  }

  return (
    <button
      type="button"
      onClick={handle}
      className={`group/bookmark flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-bold transition-all ${
        on 
          ? 'bg-amber-500 text-white shadow-lg shadow-amber-500/20' 
          : 'bg-white/80 backdrop-blur-sm text-slate-400 border border-slate-200 hover:border-amber-500 hover:text-amber-500'
      } ${className}`}
      aria-pressed={on}
      aria-label={on ? 'Remove bookmark' : 'Bookmark'}
    >
      <Star className={`h-4 w-4 transition-transform group-hover/bookmark:scale-110 ${on ? 'fill-current' : ''}`} />
      <span>{on ? 'Saved' : 'Save'}</span>
    </button>
  )
}
