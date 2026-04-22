import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { useGamification } from '../context/GamificationContext'
import { useNotes } from '../context/NotesContext'
import { useToast } from '../context/ToastContext'

function formatDate(iso) {
  try {
    return new Intl.DateTimeFormat(undefined, { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(iso))
  } catch {
    return iso
  }
}

function CommentBlock({ note, c, depth = 0 }) {
  const { isAuthenticated, user } = useAuth()
  const { addComment, markCommentHelpful, setBestAnswer } = useNotes()
  const { showToast } = useToast()
  const { reward } = useGamification()
  const [reply, setReply] = useState('')
  const [open, setOpen] = useState(false)
  const isAuthor = user?.id === note.uploadedBy?.id || user?.role === 'admin'

  const submitReply = (e) => {
    e.preventDefault()
    if (!isAuthenticated) {
      showToast('Sign in to reply.', 'info')
      return
    }
    const body = reply.trim()
    if (!body) return
    addComment(note.id, user?.name || 'Student', body, c.id, note.comments || [])
    setReply('')
    setOpen(false)
    reward('comment')
    showToast('Reply posted.', 'success')
  }

  const helpful = () => {
    markCommentHelpful(note.id, c.id)
    reward('helpful')
    showToast('Marked helpful.', 'success')
  }

  const best = () => {
    setBestAnswer(note.id, c.id)
    showToast('Highlighted as best answer.', 'success')
  }

  const nested = (c.replies || []).filter(Boolean)

  return (
    <li className={`group/comment space-y-4 ${depth > 0 ? 'ml-8 mt-4 border-l-2 border-slate-100 pl-6' : ''}`}>
      <div className="flex items-start gap-4">
        <div className="h-10 w-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-400 font-black text-sm shrink-0 shadow-sm border border-slate-200">
          {(c.authorName || 'S')[0]}
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-black text-slate-900 text-sm">{c.authorName}</span>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
              {formatDate(c.createdAt)}
            </span>
            {c.bestAnswer && (
              <span className="bg-amber-100 text-amber-600 text-[10px] font-black px-2 py-0.5 rounded-lg uppercase tracking-wider border border-amber-200">
                Best Answer
              </span>
            )}
          </div>
          
          <p className="text-sm font-medium text-slate-600 leading-relaxed mb-3">
            {c.body}
          </p>

          <div className="flex items-center gap-4">
            <button
              onClick={helpful}
              className={`flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest transition-colors ${
                (c.helpful || 0) > 0 ? 'text-emerald-600' : 'text-slate-400 hover:text-emerald-500'
              }`}
            >
              <ThumbsUp className="h-3 w-3" />
              Helpful ({c.helpful || 0})
            </button>
            
            {depth === 0 && (
              <button
                onClick={() => setOpen(!open)}
                className="text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-slate-900 transition-colors"
              >
                Reply
              </button>
            )}

            {isAuthor && !c.bestAnswer && (
              <button
                onClick={best}
                className="text-[10px] font-black text-amber-500 uppercase tracking-widest hover:text-amber-600 transition-colors"
              >
                Mark Best
              </button>
            )}
          </div>
        </div>
      </div>

      {open && (
        <form onSubmit={submitReply} className="ml-14 animate-in fade-in slide-in-from-top-2">
          <textarea
            rows={2}
            value={reply}
            onChange={(e) => setReply(e.target.value)}
            placeholder={`Reply to ${c.authorName}...`}
            className="w-full rounded-xl border border-slate-200 bg-white p-3 text-xs font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all shadow-sm"
          />
          <div className="mt-2 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="px-3 py-1.5 text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-slate-600"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!reply.trim()}
              className="h-8 px-4 inline-flex items-center justify-center rounded-lg bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest hover:bg-emerald-600 transition-all disabled:opacity-30"
            >
              Post Reply
            </button>
          </div>
        </form>
      )}

      {nested.length > 0 && (
        <ul className="space-y-4">
          {nested.map((r) => (
            <CommentBlock key={r.id} note={note} c={r} depth={depth + 1} />
          ))}
        </ul>
      )}
    </li>
  )
}

export function CommentThread({ note }) {
  const { isAuthenticated, user } = useAuth()
  const { commentsFor, addComment } = useNotes()
  const { showToast } = useToast()
  const { reward } = useGamification()
  const [text, setText] = useState('')
  const list = commentsFor(note)

  const submit = (e) => {
    e.preventDefault()
    if (!isAuthenticated) {
      showToast('Sign in to comment.', 'info')
      return
    }
    const body = text.trim()
    if (!body) return
    addComment(note.id, user?.name || 'Student', body, null)
    setText('')
    reward('comment')
    showToast('Comment added.', 'success')
  }

  return (
    <section className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-xl font-black text-slate-900">Comments</h2>
          <p className="text-sm font-medium text-slate-500">{list.length} discussions in this thread</p>
        </div>
      </div>

      <ul className="space-y-6 mb-8">
        {list.length === 0 ? (
          <li className="py-12 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-200">
            <div className="text-slate-400 font-bold mb-1">No comments yet</div>
            <p className="text-xs text-slate-500">Be the first to start the discussion!</p>
          </li>
        ) : (
          list.map((c) => <CommentBlock key={c.id} note={note} c={c} />)
        )}
      </ul>

      <form onSubmit={submit} className="relative group">
        <textarea
          rows={3}
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={isAuthenticated ? 'Write a comment...' : 'Sign in to join the discussion'}
          disabled={!isAuthenticated}
          className="w-full rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all disabled:opacity-50"
        />
        <div className="mt-4 flex justify-end">
          <button
            type="submit"
            disabled={!isAuthenticated || !text.trim()}
            className="h-10 px-6 inline-flex items-center justify-center rounded-xl bg-slate-900 text-white text-sm font-black uppercase tracking-widest hover:bg-emerald-600 transition-all active:scale-95 disabled:opacity-30 disabled:pointer-events-none"
          >
            Post Comment
          </button>
        </div>
      </form>
    </section>
  )
}
