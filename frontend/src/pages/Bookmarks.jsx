import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Bookmark, BookOpen, Star, Search, Filter, Heart, Sparkles } from 'lucide-react'
import { NoteCard } from '../components/NoteCard'
import { useNotes } from '../context/NotesContext'

export function Bookmarks() {
  const { notes, bookmarks } = useNotes()
  const saved = useMemo(
    () => notes.filter((n) => bookmarks.has(n.id)).sort((a, b) => a.title.localeCompare(b.title)),
    [notes, bookmarks]
  )

  return (
    <div className="space-y-12">
      <motion.header 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-wrap items-end justify-between gap-6"
      >
        <div className="max-w-2xl">
          <div className="mb-4 inline-flex items-center gap-2 rounded-xl bg-purple-500/10 px-3 py-1 text-sm font-bold text-purple-600">
            <Bookmark className="h-4 w-4" />
            <span>Saved</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tight text-slate-900 mb-4">
            Your <span className="text-purple-500">Bookmarks.</span>
          </h1>
          <p className="text-lg font-medium text-slate-600">
            Keep track of the most helpful notes and resources you've found across the platform.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="h-12 px-6 inline-flex items-center gap-2 rounded-xl bg-slate-100 text-sm font-bold text-slate-600">
            <Star className="h-4 w-4" />
            {saved.length} Saved
          </div>
        </div>
      </motion.header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {saved.length === 0 ? (
          <div className="col-span-full glass-enhanced rounded-3xl border border-slate-200 py-20 text-center">
            <div className="mx-auto mb-6 h-24 w-24 rounded-full bg-slate-50 flex items-center justify-center">
              <Bookmark className="h-10 w-10 text-slate-300" />
            </div>
            <h3 className="text-2xl font-black text-slate-900 mb-2">No bookmarks yet</h3>
            <p className="text-slate-500 font-medium mb-8">Start saving notes to see them here.</p>
            <Link
              to="/browse"
              className="inline-flex items-center gap-2 px-8 py-3 rounded-xl bg-slate-900 text-sm font-bold text-white hover:bg-emerald-600 transition-all shadow-xl shadow-slate-900/10"
            >
              <Search className="h-4 w-4" />
              Browse Notes
            </Link>
          </div>
        ) : (
          saved.map((note) => (
            <NoteCard key={note.id} note={note} />
          ))
        )}
      </div>
    </div>
  )
}
