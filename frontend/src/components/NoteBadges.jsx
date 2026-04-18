export function NoteBadges({ note, compact }) {
  const items = []
  if (note.verifiedFaculty) items.push({ key: 'v', label: 'Faculty verified', emoji: '✔' })
  if (note.trending) items.push({ key: 't', label: 'Trending', emoji: '🔥' })
  if (note.bestForExams || note.examFocused) items.push({ key: 'e', label: 'Best for exams', emoji: '⭐' })
  if (note.pyqBased || ['pyq', 'mid_term', 'end_sem'].includes(note.noteType))
    items.push({ key: 'p', label: 'PYQ / Paper', emoji: '📝' })
  if (note.recommended) items.push({ key: 'r', label: 'Recommended', emoji: '📌' })
  if (note.ocrIndexed) items.push({ key: 'o', label: 'OCR searchable', emoji: '🔎' })
  if (note.source === 'faculty') items.push({ key: 'f', label: 'Faculty notes', emoji: '🎓' })

  if (!items.length) return null

  if (compact) {
    return (
      <span className="inline-flex flex-wrap gap-1" aria-label="Note badges">
        {items.map((x) => (
          <span key={x.key} title={x.label} className="text-xs">
            {x.emoji}
          </span>
        ))}
      </span>
    )
  }

  return (
    <div className="flex flex-wrap gap-1.5">
      {items.map((x) => (
        <span
          key={x.key}
          title={x.label}
          className="inline-flex items-center gap-1 rounded-md border border-accent/25 bg-accent/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-accent-2"
        >
          <span aria-hidden>{x.emoji}</span>
          {x.label}
        </span>
      ))}
    </div>
  )
}
