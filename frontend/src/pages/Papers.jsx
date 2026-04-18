import { useMemo } from 'react'
import { NoteCard } from '../components/NoteCard'
import { useNotes } from '../context/NotesContext'
import { filterAndSortNotes } from '../utils/noteFilters'

export function Papers() {
  const { notes, score } = useNotes()
  const list = useMemo(
    () =>
      filterAndSortNotes(
        notes,
        {
          noteType: '',
          pyqOnly: true,
          sort: 'downloads',
        },
        score
      ),
    [notes, score]
  )

  return (
    <div className="space-y-8">
      <header>
        <h1 className="font-display text-3xl font-bold text-slate-50">Previous year papers & banks</h1>
        <p className="mt-2 text-muted">PYQs, mid/end sem papers, lab manuals, and question banks in one lane.</p>
      </header>
      <div className="grid gap-6 md:grid-cols-2">
        {list.map((n) => (
          <NoteCard key={n.id} note={n} />
        ))}
      </div>
    </div>
  )
}
