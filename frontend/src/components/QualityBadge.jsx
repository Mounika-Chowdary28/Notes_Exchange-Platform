import { computeQualityScore, isMostHelpful } from '../utils/qualityScore'
import { useNotes } from '../context/NotesContext'

export function QualityBadge({ note }) {
  const { score, getBookmarkCount } = useNotes()
  const s = score(note)
  const bc = getBookmarkCount(note)
  const q = computeQualityScore(note, s.net, bc)
  const helpful = isMostHelpful(note, s.net, bc)

  return (
    <div className="flex flex-wrap items-center gap-2">
      <span
        className="rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-black text-emerald-600 shadow-sm"
        title="Composite quality score"
      >
        {q.toFixed(1)} <span className="text-[10px] opacity-60">/ 5.0</span>
      </span>
      {helpful ? (
        <span className="rounded-xl border border-amber-200 bg-amber-50 px-3 py-1.5 text-[10px] font-black uppercase tracking-wider text-amber-600 shadow-sm">
          🔥 Most helpful
        </span>
      ) : null}
    </div>
  )
}
