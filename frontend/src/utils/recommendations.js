/**
 * @param {object[]} notes
 * @param {{ branch?: string, semester?: number }} profile
 * @param {string[]} recentSubjectCodes
 * @param {(n: object) => { net: number }} scoreFn
 */
export function getSmartRecommendations(notes, profile, recentSubjectCodes, scoreFn) {
  const branch = profile?.branch
  const sem = profile?.semester
  const recent = new Set((recentSubjectCodes || []).map((c) => c?.toUpperCase()))

  const scored = notes.map((n) => {
    let w = 0
    if (branch && n.branch === branch) w += 3
    if (sem != null && n.semester === sem) w += 3
    if (recent.has(n.subjectCode?.toUpperCase())) w += 2.5
    w += Math.min(2, Math.log10((n.downloads || 0) + 10) * 0.9)
    w += Math.min(2, scoreFn(n).net * 0.03)
    if (n.trending) w += 1.2
    if (n.recommended) w += 0.8
    if (['pyq', 'mid_term', 'end_sem'].includes(n.noteType)) w += 0.6
    return { n, w }
  })

  return scored.sort((a, b) => b.w - a.w).map((x) => x.n)
}

export function topRatedNotes(notes, scoreFn, limit = 6) {
  return [...notes].sort((a, b) => scoreFn(b).net - scoreFn(a).net).slice(0, limit)
}
