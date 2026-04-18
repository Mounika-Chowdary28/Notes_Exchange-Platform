import { useMemo } from 'react'
import { NoteCard } from '../components/NoteCard'
import { useNotes } from '../context/NotesContext'
import { filterAndSortNotes } from '../utils/noteFilters'

export function ExamPrep() {
  const { notes, score } = useNotes()
  const top = useMemo(
    () =>
      filterAndSortNotes(notes, { sort: 'top', examOnly: true, pyqOnly: false }, score).slice(0, 6),
    [notes, score]
  )
  const pyq = useMemo(
    () => filterAndSortNotes(notes, { pyqOnly: true, sort: 'downloads' }, score).slice(0, 6),
    [notes, score]
  )
  const revision = useMemo(
    () =>
      notes
        .filter((n) => n.noteType === 'revision' || n.noteType === 'cheat_sheet' || n.bestForExams)
        .sort((a, b) => b.downloads - a.downloads)
        .slice(0, 6),
    [notes]
  )
  const hot = useMemo(
    () => [...notes].sort((a, b) => (b.views || 0) - (a.views || 0)).slice(0, 6),
    [notes]
  )

  return (
    <div className="space-y-12">
      <header>
        <h1 className="font-display text-3xl font-bold text-slate-50 sm:text-4xl">Exam prep mode</h1>
        <p className="mt-2 max-w-2xl text-muted">
          One screen for top-rated materials, PYQs, revision sets, and what’s trending by views this week.
        </p>
      </header>
      {[
        { title: 'Top-rated exam-focused', items: top },
        { title: 'Previous year & papers', items: pyq },
        { title: 'Revision & cheat sheets', items: revision },
        { title: 'Most viewed lately', items: hot },
      ].map((sec) => (
        <section key={sec.title}>
          <h2 className="font-display text-2xl font-semibold text-gray-900">{sec.title}</h2>
          <div className="mt-4 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {sec.items.map((n) => (
              <NoteCard key={n.id} note={n} />
            ))}
          </div>
        </section>
      ))}
    </div>
  )
}
