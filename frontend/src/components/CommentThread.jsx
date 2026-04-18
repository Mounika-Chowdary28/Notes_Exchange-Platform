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
    <li
      className={`rounded-xl border border-gray-300/20 bg-white/60 p-4 ${depth ? 'ml-4 border-l-2 border-l-accent/40' : ''}`}
    >
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <span className="font-semibold text-accent">{c.authorName}</span>
        <time className="text-xs text-muted" dateTime={c.createdAt}>
          {formatDate(c.createdAt)}
        </time>
      </div>
      {c.bestAnswer ? (
        <p className="mt-1 text-[10px] font-bold uppercase tracking-wider text-warm">★ Best answer</p>
      ) : null}
      <p className="mt-2 text-sm leading-relaxed text-gray-700">{c.body}</p>
      <div className="mt-3 flex flex-wrap gap-2 text-xs">
        <button type="button" onClick={helpful} className="rounded-lg border border-gray-300/40 px-2 py-1 text-gray-700 hover:bg-surface-2">
          Helpful ({c.helpful || 0})
        </button>
        {isAuthor ? (
          <button type="button" onClick={best} className="rounded-lg border border-warm/40 px-2 py-1 text-warm hover:bg-warm/10">
            Mark best
          </button>
        ) : null}
        {depth === 0 ? (
          <button type="button" onClick={() => setOpen((o) => !o)} className="rounded-lg border border-accent/35 px-2 py-1 text-accent hover:bg-accent/10">
            Reply
          </button>
        ) : null}
      </div>
      {open ? (
        <form onSubmit={submitReply} className="mt-3 space-y-2">
          <textarea
            rows={2}
            value={reply}
            onChange={(e) => setReply(e.target.value)}
            placeholder="Write a reply…"
            className="focus-ring w-full rounded-lg border border-gray-300 bg-white/95 p-2 text-sm text-gray-900 placeholder:text-gray-400"
          />
          <button type="submit" className="rounded-lg bg-accent px-3 py-1 text-xs font-bold text-white">
            Post reply
          </button>
        </form>
      ) : null}
      {nested.length ? (
        <ul className="mt-4 space-y-3">
          {nested.map((r) => (
            <CommentBlock key={r.id} note={note} c={r} depth={depth + 1} />
          ))}
        </ul>
      ) : null}
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
    <section className="glass rounded-2xl border border-slate-600/20 p-6">
      <h2 className="font-display text-xl font-semibold text-gray-900">Discussion</h2>
      <p className="mt-1 text-sm text-muted">Threaded replies, helpful votes, and best-answer highlights.</p>

      <ul className="mt-6 space-y-4">
        {list.length === 0 ? (
          <li className="rounded-xl border border-dashed border-gray-300/40 py-8 text-center text-sm text-muted">
            No comments yet. Start the thread.
          </li>
        ) : (
          list.map((c) => <CommentBlock key={c.id} note={note} c={c} />)
        )}
      </ul>

      <form onSubmit={submit} className="mt-6">
        <label htmlFor="comment" className="sr-only">
          Add a comment
        </label>
        <textarea
          id="comment"
          rows={3}
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={isAuthenticated ? 'Ask a doubt or say thanks…' : 'Sign in to comment'}
          disabled={!isAuthenticated}
          className="focus-ring w-full rounded-xl border border-gray-300 bg-white/95 p-3 text-sm text-gray-900 placeholder:text-gray-400 disabled:opacity-50"
        />
        <div className="mt-3 flex justify-end">
          <button
            type="submit"
            disabled={!isAuthenticated || !text.trim()}
            className="focus-ring rounded-xl bg-accent px-4 py-2 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-40"
          >
            Post comment
          </button>
        </div>
      </form>
    </section>
  )
}
