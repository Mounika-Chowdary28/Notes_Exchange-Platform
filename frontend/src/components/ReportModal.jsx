import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { useNotes } from '../context/NotesContext'
import { useToast } from '../context/ToastContext'

const REASONS = [
  { id: 'broken', label: 'Broken file / won’t open' },
  { id: 'wrong_subject', label: 'Wrong subject / metadata' },
  { id: 'duplicate', label: 'Duplicate upload' },
  { id: 'spam', label: 'Spam / inappropriate' },
]

export function ReportModal({ open, onClose, noteId }) {
  const { user } = useAuth()
  const { submitReport } = useNotes()
  const { showToast } = useToast()
  const [reason, setReason] = useState('broken')
  const [detail, setDetail] = useState('')

  if (!open) return null

  const send = (e) => {
    e.preventDefault()
    submitReport({
      noteId,
      reason,
      detail: detail.trim(),
      byUser: user?.id,
      byName: user?.name,
    })
    showToast('Report submitted for moderator review.', 'success')
    setDetail('')
    onClose()
  }

  return (
    <div className="fixed inset-0 z-[130] flex items-center justify-center bg-black/65 p-4 backdrop-blur-sm">
      <div className="glass w-full max-w-md rounded-2xl border border-slate-600/30 p-6">
        <h3 className="font-display text-xl font-semibold text-slate-50">Report note</h3>
        <p className="mt-1 text-sm text-muted">Helps admins keep the catalog accurate (demo queue stored locally).</p>
        <form onSubmit={send} className="mt-4 space-y-4">
          <div>
            <label className="text-xs font-medium text-slate-400">Reason</label>
            <select
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="focus-ring mt-1 w-full rounded-xl border border-slate-600/40 bg-surface-0/90 px-3 py-2 text-sm"
            >
              {REASONS.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-xs font-medium text-slate-400">Details (optional)</label>
            <textarea
              value={detail}
              onChange={(e) => setDetail(e.target.value)}
              rows={3}
              className="focus-ring mt-1 w-full rounded-xl border border-slate-600/40 bg-surface-0/90 px-3 py-2 text-sm"
            />
          </div>
          <div className="flex justify-end gap-2">
            <button type="button" onClick={onClose} className="rounded-xl border border-slate-600/40 px-4 py-2 text-sm">
              Cancel
            </button>
            <button type="submit" className="rounded-xl bg-warm px-4 py-2 text-sm font-semibold text-surface-0">
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
