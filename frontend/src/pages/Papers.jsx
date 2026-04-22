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
        {list.length > 0 ? (
          list.map((n) => (
            <NoteCard key={n.id} note={n} />
          ))
        ) : (
          <div className="col-span-full rounded-2xl border border-dashed border-slate-600/30 py-12 text-center">
            <p className="text-muted">No previous year papers or question banks found.</p>
            <p className="mt-1 text-xs text-slate-500">Try searching in "Browse" or upload a new paper with the correct category.</p>
          </div>
        )}
      </div>
    </div>
  )
}
