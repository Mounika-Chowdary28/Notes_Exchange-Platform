import { useMemo } from 'react'
import { motion } from 'framer-motion'
import { FileText, Calendar, Clock, Download, Eye, Search, Filter, Award, BookOpen, Archive, TrendingUp, Star, Zap } from 'lucide-react'
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
    <div className="space-y-12">
      <motion.header 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-wrap items-end justify-between gap-6"
      >
        <div className="max-w-2xl">
          <div className="mb-4 inline-flex items-center gap-2 rounded-xl bg-orange-500/10 px-3 py-1 text-sm font-bold text-orange-600">
            <Archive className="h-4 w-4" />
            <span>Archive</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tight text-slate-900 mb-4">
            Previous Year <span className="text-orange-500">Papers.</span>
          </h1>
          <p className="text-lg font-medium text-slate-600">
            Access a comprehensive collection of mid-term, end-sem papers, and question banks.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="h-12 px-6 inline-flex items-center gap-2 rounded-xl bg-slate-100 text-sm font-bold text-slate-600">
            <FileText className="h-4 w-4" />
            {list.length} Papers
          </div>
        </div>
      </motion.header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {list.map((note) => (
          <NoteCard key={note.id} note={note} />
        ))}
      </div>
    </div>
  )
}
