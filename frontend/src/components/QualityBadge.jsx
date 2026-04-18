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
        className="rounded-lg border border-accent-2/30 bg-accent-2/10 px-2 py-1 font-mono text-xs font-bold text-accent-2"
        title="Composite quality score"
      >
        {q.toFixed(1)} / 5
      </span>
      {helpful ? (
        <span className="rounded-lg border border-gold/35 bg-gold/15 px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-gold">
          Most helpful
        </span>
      ) : null}
    </div>
  )
}
