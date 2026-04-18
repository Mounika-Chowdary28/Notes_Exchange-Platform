/**
 * Quality score 1.0–5.0 from engagement signals (demo formula).
 * @param {{ upvotes?: number, downvotes?: number, downloads?: number, views?: number, reportCount?: number }} note
 * @param {{ netVotes: number }} liveVotes effective up - down including user
 * @param {number} bookmarkCount total bookmarks (base + simulated community)
 */
export function computeQualityScore(note, liveVotes, bookmarkCount = 0) {
  const net = Math.max(-50, liveVotes)
  const d = note.downloads ?? 0
  const v = note.views ?? 0
  const r = note.reportCount ?? 0
  const b = bookmarkCount

  let score = 2.4
  score += Math.min(1.1, net * 0.018)
  score += Math.min(0.85, Math.log10(d + 12) * 0.32)
  score += Math.min(0.65, Math.log10(v + 20) * 0.22)
  score += Math.min(0.45, Math.log10(b + 8) * 0.28)
  score -= Math.min(1.4, r * 0.35)

  const rounded = Math.round(Math.min(5, Math.max(1, score)) * 10) / 10
  return rounded
}

export function isMostHelpful(note, liveNet, bookmarkCount) {
  return computeQualityScore(note, liveNet, bookmarkCount) >= 4.5 && liveNet >= 40
}
