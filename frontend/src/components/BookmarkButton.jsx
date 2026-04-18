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
      className={`focus-ring inline-flex items-center gap-2 rounded-xl border border-slate-600/35 bg-surface-1/80 px-3 py-2 text-sm font-medium transition hover:border-accent/40 hover:bg-surface-2 ${
        on ? 'text-warm border-warm/30' : 'text-slate-300'
      } ${className}`}
      aria-pressed={on}
      aria-label={on ? 'Remove bookmark' : 'Bookmark'}
    >
      <span className="text-base" aria-hidden>
        {on ? '★' : '☆'}
      </span>
      {on ? 'Saved' : 'Save'}
    </button>
  )
}
