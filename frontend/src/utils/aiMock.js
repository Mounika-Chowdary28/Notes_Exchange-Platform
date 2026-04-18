/**
 * Demo "AI" assistant — rule-based suggestions over local notes (replace with API).
 */
export function buildAiReply(userText, notes, scoreFn) {
  const t = userText.toLowerCase()
  const codes = [...new Set(notes.map((n) => n.subjectCode))]

  const matchCode = codes.find((c) => t.includes(c.toLowerCase()))
  const subjects = [...new Set(notes.map((n) => n.subject))]

  let subjectHint = subjects.find((s) => t.includes(s.toLowerCase().slice(0, 5)))

  let picked = notes
  if (matchCode) picked = picked.filter((n) => n.subjectCode === matchCode)
  else if (subjectHint) picked = picked.filter((n) => n.subject === subjectHint)

  if (t.includes('unit 3') || t.includes('unit-3')) {
    picked = picked.filter((n) => (n.unit || '').toLowerCase().includes('3'))
  }
  if (t.includes('pyq') || t.includes('previous year') || t.includes('paper')) {
    picked = picked.filter((n) => n.pyqBased || ['pyq', 'mid_term', 'end_sem'].includes(n.noteType))
  }
  if (t.includes('revision') || t.includes('last minute') || t.includes('exam')) {
    picked = picked.filter((n) => n.bestForExams || n.noteType === 'revision' || n.noteType === 'cheat_sheet')
  }
  if (t.includes('lab') || t.includes('viva')) {
    picked = picked.filter((n) => n.labViva || n.noteType === 'lab_manual')
  }

  picked = [...picked].sort((a, b) => scoreFn(b).net - scoreFn(a).net).slice(0, 5)

  const intro =
    picked.length > 0
      ? `Here are strong matches from the catalog (ranked by votes + relevance):`
      : `I broadened the search — try naming a subject code (e.g. CS302) or saying “PYQ”, “lab”, or “revision”.`

  const fallback = !picked.length ? [...notes].sort((a, b) => scoreFn(b).net - scoreFn(a).net).slice(0, 5) : picked

  return {
    intro,
    noteIds: (picked.length ? picked : fallback).map((n) => n.id),
    tips: [
      'Tip: combine subject code + “Unit 2” for narrower picks.',
      'Tip: ask “Important topics before exams” to surface revision & PYQ sets.',
    ],
  }
}
