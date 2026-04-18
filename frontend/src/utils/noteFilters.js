/**
 * @param {object[]} notes
 * @param {object} query
 * @param {(n: object) => { up: number, down: number, net: number }} [scoreFn]
 */
export function filterAndSortNotes(notes, query, scoreFn) {
  let list = [...notes]
  const {
    semester,
    branch,
    subject,
    subjectCode,
    unit,
    q,
    tags,
    fileType,
    noteType,
    difficulty,
    source,
    verifiedOnly,
    examOnly,
    pyqOnly,
    sort = 'top',
  } = query

  if (semester != null && semester !== '') {
    const s = Number(semester)
    list = list.filter((n) => n.semester === s)
  }
  if (branch) list = list.filter((n) => n.branch === branch)
  if (subject) {
    const t = subject.trim().toLowerCase()
    list = list.filter((n) => n.subject.toLowerCase().includes(t))
  }
  if (subjectCode) {
    const code = subjectCode.trim().toUpperCase()
    list = list.filter((n) => n.subjectCode.toUpperCase().includes(code))
  }
  if (unit) {
    const u = unit.trim().toLowerCase()
    list = list.filter((n) => (n.unit || '').toLowerCase().includes(u))
  }
  if (fileType) list = list.filter((n) => n.fileType === fileType)
  if (noteType) list = list.filter((n) => n.noteType === noteType)
  if (difficulty) list = list.filter((n) => n.difficulty === difficulty)
  if (source) list = list.filter((n) => n.source === source)
  if (verifiedOnly) list = list.filter((n) => n.verifiedFaculty)
  if (examOnly) list = list.filter((n) => n.bestForExams || n.examFocused || n.importantExam)
  if (pyqOnly) list = list.filter((n) => n.pyqBased || ['pyq', 'mid_term', 'end_sem'].includes(n.noteType))

  if (q) {
    const t = q.trim().toLowerCase()
    list = list.filter((n) => {
      const tagHit = (n.tags || []).some((tag) => tag.toLowerCase().includes(t))
      return (
        n.title.toLowerCase().includes(t) ||
        n.subject.toLowerCase().includes(t) ||
        n.subjectCode.toLowerCase().includes(t) ||
        (n.description && n.description.toLowerCase().includes(t)) ||
        tagHit
      )
    })
  }

  if (tags) {
    const want = tags
      .split(',')
      .map((x) => x.trim().toLowerCase())
      .filter(Boolean)
    if (want.length) {
      list = list.filter((n) => {
        const nt = (n.tags || []).map((x) => x.toLowerCase())
        return want.some((w) => nt.some((t) => t.includes(w)))
      })
    }
  }

  if (sort === 'new') {
    list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
  } else if (sort === 'downloads') {
    list.sort((a, b) => b.downloads - a.downloads)
  } else if (sort === 'views') {
    list.sort((a, b) => (b.views || 0) - (a.views || 0))
  } else if (sort === 'quality' && scoreFn) {
    list.sort((a, b) => {
      const qa = scoreFn(a).net + (a.downloads || 0) * 0.01 + (a.views || 0) * 0.002
      const qb = scoreFn(b).net + (b.downloads || 0) * 0.01 + (b.views || 0) * 0.002
      return qb - qa
    })
  } else if (scoreFn) {
    list.sort((a, b) => scoreFn(b).net - scoreFn(a).net)
  } else {
    list.sort((a, b) => b.upvotes - b.downvotes - (a.upvotes - a.downvotes))
  }

  return list
}
