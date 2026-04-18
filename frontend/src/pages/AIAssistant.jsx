import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useNotes } from '../context/NotesContext'
import { buildAiReply } from '../utils/aiMock'

export function AIAssistant() {
  const { notes, score } = useNotes()
  const [input, setInput] = useState('Best notes for DBMS Unit 3 before exams')
  const [log, setLog] = useState([])

  const send = (e) => {
    e.preventDefault()
    const reply = buildAiReply(input, notes, score)
    setLog((l) => [...l, { q: input, reply }])
  }

  const last = log[log.length - 1]
  const picks = useMemo(() => {
    if (!last) return []
    return last.reply.noteIds.map((id) => notes.find((n) => n.id === id)).filter(Boolean)
  }, [last, notes])

  return (
    <div className="space-y-8">
      <header>
        <h1 className="font-display text-3xl font-bold text-slate-50">AI study assistant (demo)</h1>
        <p className="mt-2 text-muted">
          Rule-based assistant over your local catalog — swap for OpenAI / Gemini + RAG when backend is ready.
        </p>
      </header>
      <form onSubmit={send} className="glass rounded-2xl border border-accent/25 p-6">
        <label className="text-sm text-muted">Ask anything study-related</label>
        <textarea
          rows={3}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="focus-ring mt-2 w-full rounded-xl border border-slate-600/40 bg-surface-0/90 p-3 text-sm"
        />
        <button type="submit" className="mt-3 rounded-xl bg-accent px-5 py-2 text-sm font-bold text-white">
          Get suggestions
        </button>
      </form>
      {last ? (
        <div className="glass rounded-2xl border border-slate-600/25 p-6">
          <p className="text-sm text-gray-700">{last.reply.intro}</p>
          <ul className="mt-4 space-y-2">
            {picks.map((n) => (
              <li key={n.id}>
                <Link className="text-accent hover:underline" to={`/notes/${n.id}`}>
                  {n.subjectCode} — {n.title}
                </Link>
              </li>
            ))}
          </ul>
          <ul className="mt-4 text-xs text-muted">
            {last.reply.tips.map((t) => (
              <li key={t}>{t}</li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  )
}
